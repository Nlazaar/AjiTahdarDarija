/**
 * Génère `web/data/arab-world-outline.json` à partir du dataset Natural Earth
 * 1:110M (pays, GeoJSON), en ne gardant que les pays de la Ligue arabe.
 *
 * Important : Natural Earth sépare le Sahara (ISO `ESH`) du Maroc. Pour
 * respecter l'intégrité territoriale marocaine (les provinces du Sud font
 * partie du Royaume du Maroc), on inclut `ESH` dans la sélection : les deux
 * features sont ensuite rendues comme un seul pays côté carte.
 *
 * Source : https://github.com/nvkelso/natural-earth-vector/ (CC0)
 * Usage  : cd backend && npx tsx scripts/generateArabOutline.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import union from '@turf/union';
import { featureCollection } from '@turf/helpers';

const URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

// ISO-3 des 22 membres de la Ligue arabe + ESH (Sahara, rattaché au Maroc).
const KEEP_ISO3 = new Set([
  // Maghreb (MAR + ESH = Maroc unifié)
  'MAR', 'ESH', 'DZA', 'TUN', 'LBY', 'MRT',
  // Afrique de l'Est / Corne
  'EGY', 'SDN', 'SOM', 'DJI', 'COM',
  // Péninsule arabique
  'SAU', 'YEM', 'OMN', 'ARE', 'QAT', 'BHR', 'KWT',
  // Levant + Mésopotamie
  'PSE', 'JOR', 'LBN', 'SYR', 'IRQ',
]);

async function main() {
  console.log('🌍 Téléchargement du dataset Natural Earth 110M...');
  const res = await fetch(URL);
  if (!res.ok) {
    console.error(`❌ Fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const data: any = await res.json();
  console.log(`   ✓ ${data.features?.length ?? 0} pays source`);

  const filtered = data.features.filter((f: any) => {
    const iso = f?.properties?.ISO_A3_EH ?? f?.properties?.ISO_A3;
    return iso && KEEP_ISO3.has(iso);
  });
  console.log(`   ✓ ${filtered.length} pays retenus`);

  // Rattache le Sahara au Maroc : mêmes name/iso pour le rendu continu.
  const lean = filtered.map((f: any) => {
    let iso  = f.properties?.ISO_A3_EH ?? f.properties?.ISO_A3;
    let name = f.properties?.NAME_FR ?? f.properties?.NAME ?? f.properties?.NAME_LONG;
    if (iso === 'ESH') {
      iso  = 'MAR';
      name = 'Maroc';
    }
    return {
      type: 'Feature',
      properties: { name, iso },
      geometry: f.geometry,
    };
  });

  // Fusion géométrique des features partageant le même ISO (cas : MAR + ex-ESH).
  // Sans cela, la frontière interne Maroc/Sahara est tracée en double.
  const byIso = new Map<string, any[]>();
  for (const f of lean) {
    const arr = byIso.get(f.properties.iso) ?? [];
    arr.push(f);
    byIso.set(f.properties.iso, arr);
  }
  // @turf/union renvoie un polygone avec le winding inverse de celui attendu
  // par d3-geo (qui interprète un polygone mal orienté comme "tout le globe
  // sauf l'intérieur", produisant un énorme rectangle au rendu). On inverse
  // donc les anneaux après union pour normaliser.
  const reverseRings = (geom: any): any => {
    if (geom.type === 'Polygon') {
      return { type: 'Polygon', coordinates: geom.coordinates.map((r: any[]) => [...r].reverse()) };
    }
    if (geom.type === 'MultiPolygon') {
      return {
        type: 'MultiPolygon',
        coordinates: geom.coordinates.map((poly: any[]) => poly.map((r: any[]) => [...r].reverse())),
      };
    }
    return geom;
  };

  const merged: any[] = [];
  for (const [iso, group] of byIso) {
    if (group.length === 1) { merged.push(group[0]); continue; }
    const fc = featureCollection(group as any);
    const u = union(fc as any);
    if (!u) { merged.push(...group); continue; }
    merged.push({
      type: 'Feature',
      properties: { name: group[0].properties.name, iso },
      geometry: reverseRings(u.geometry),
    });
    console.log(`   ⇢ fusion ${iso} : ${group.length} polygones → 1 (winding normalisé)`);
  }

  const out = { type: 'FeatureCollection', features: merged };
  const outPath = path.resolve(__dirname, '../../web/data/arab-world-outline.json');
  fs.writeFileSync(outPath, JSON.stringify(out));
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`\n✅ Écrit : ${outPath}`);
  console.log(`   ${merged.length} features, ${sizeKB} KB`);
  console.log('\nPays retenus :');
  merged.forEach((f: any) => console.log(`  - ${f.properties.iso}  ${f.properties.name}`));
}

main().catch(e => {
  console.error('❌ Erreur :', e);
  process.exit(1);
});
