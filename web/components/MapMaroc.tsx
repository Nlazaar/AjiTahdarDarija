'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import moroccoOutline from '@/data/morocco-outline.json'
import arabOutline from '@/data/arab-world-outline.json'
import islamOutline from '@/data/islam-world-outline.json'
import { MOROCCO_CITIES } from '@/data/morocco-cities'
import { ARAB_CITIES } from '@/data/arab-cities'
import { ISLAM_CITIES } from '@/data/islam-cities'
import { getMyJourney } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { useUser } from '@/context/UserContext'

// Ville générique exposée au rendu : on unifie MoroccoCity et ArabCity.
type MapCity = {
  key: string
  order: number
  nameFr: string
  nameAr: string
  transliteration: string
  lat: number
  lng: number
  sub: string // region (DARIJA) ou country (MSA) — pour le tooltip
}

interface JourneyState {
  currentCityKey: string | null
  visitedCityKeys: Set<string>
}

export default function MapMaroc() {
  const { langTrack } = useUser()
  // MSA → monde arabe. RELIGION → héritage islamique mondial. DARIJA → Maroc.
  const isMSA = langTrack === 'MSA'
  const isReligion = langTrack === 'RELIGION'

  const { WIDTH, HEIGHT, outline, cities, citiesByKey, citiesByOrder, title, countryColor, routeColor } = useMemo(() => {
    if (isReligion) {
      const list: MapCity[] = ISLAM_CITIES.map(c => ({
        key: c.key, order: c.order,
        nameFr: c.nameFr, nameAr: c.nameAr, transliteration: c.transliteration,
        lat: c.lat, lng: c.lng, sub: c.era,
      }))
      const byKey: Record<string, MapCity> = {}
      for (const c of list) byKey[c.key] = c
      const byOrder = [...list].sort((a, b) => a.order - b.order)
      return {
        WIDTH: 320, HEIGHT: 280,
        outline: islamOutline as any,
        cities: list,
        citiesByKey: byKey,
        citiesByOrder: byOrder,
        title: 'Ton parcours dans le monde musulman',
        countryColor: '#34b35c', // vert carte
        routeColor:   '#f4b942', // ambre — contraste sur fond vert
      }
    }
    if (isMSA) {
      const list: MapCity[] = ARAB_CITIES.map(c => ({
        key: c.key, order: c.order,
        nameFr: c.nameFr, nameAr: c.nameAr, transliteration: c.transliteration,
        lat: c.lat, lng: c.lng, sub: c.country,
      }))
      const byKey: Record<string, MapCity> = {}
      for (const c of list) byKey[c.key] = c
      const byOrder = [...list].sort((a, b) => a.order - b.order)
      return {
        WIDTH: 320, HEIGHT: 280,
        outline: arabOutline as any,
        cities: list,
        citiesByKey: byKey,
        citiesByOrder: byOrder,
        title: 'Ton parcours dans le monde arabe',
        countryColor: '#3ba8bf', // turquoise carte
        routeColor:   '#f4b942', // ambre — contraste sur fond turquoise
      }
    }
    const list: MapCity[] = MOROCCO_CITIES.map(c => ({
      key: c.key, order: c.order,
      nameFr: c.nameFr, nameAr: c.nameAr, transliteration: c.transliteration,
      lat: c.lat, lng: c.lng, sub: c.region,
    }))
    const byKey: Record<string, MapCity> = {}
    for (const c of list) byKey[c.key] = c
    const byOrder = [...list].sort((a, b) => a.order - b.order)
    return {
      // Maroc (avec Sahara) est portrait — viewBox adaptée pour que le pays
      // remplisse la largeur du conteneur au lieu de laisser du vide L/R.
      WIDTH: 240, HEIGHT: 300,
      outline: moroccoOutline as any,
      cities: list,
      citiesByKey: byKey,
      citiesByOrder: byOrder,
      title: 'Ton parcours au Maroc',
      countryColor: '#c1272d', // rouge drapeau marocain
      routeColor:   '#006233', // vert drapeau marocain — clin d'œil
    }
  }, [isMSA, isReligion])

  const [journey, setJourney] = useState<JourneyState>({
    currentCityKey: null,
    visitedCityKeys: new Set(),
  })
  const [hovered, setHovered] = useState<MapCity | null>(null)

  useEffect(() => {
    if (!getToken()) return
    const trackParam = isReligion ? 'RELIGION' : isMSA ? 'MSA' : 'DARIJA'
    getMyJourney(trackParam)
      .then(j => setJourney({
        currentCityKey: j.currentCityKey,
        visitedCityKeys: new Set(j.visitedCityKeys),
      }))
      .catch(() => {})
  }, [isMSA, isReligion])

  // Ensemble des pays "actifs" (contenant une ville du parcours) — RELIGION only
  const highlightIso3 = useMemo(() => {
    if (!isReligion) return new Set<string>()
    return new Set(ISLAM_CITIES.map(c => c.iso3))
  }, [isReligion])

  // Projection fittée à chaque changement de track
  const { outlineD, cityPoints, highlightedPaths, insetOutlineD, insetBox, viewBox } = useMemo(() => {
    // RELIGION : Indonésie / Malaisie / Brunei sont très à l'est — on les exclut
    // de la projection principale pour garder un zoom confortable, puis on les
    // dessine en cartouche (inset) bas-droite avec leur propre projection.
    const PERIPH = new Set(['IDN', 'MYS', 'BRN'])
    // moroccoOutline est un Feature unique ; arab/islam sont des FeatureCollection.
    const allFeatures: any[] = Array.isArray((outline as any)?.features)
      ? (outline as any).features
      : []
    const mainFeatures = isReligion
      ? allFeatures.filter((f) => !PERIPH.has(f?.properties?.iso))
      : allFeatures
    const mainTarget: any = allFeatures.length > 0
      ? { type: 'FeatureCollection', features: mainFeatures }
      : outline
    // Padding intérieur pour éviter que les marqueurs de ville (Tanger au Nord,
    // Dakhla au Sud) soient coupés par le bord du viewBox. Le marqueur courant
    // a un rayon externe de 9px (pulse), donc 12px de padding assure de la marge.
    const PAD = 12
    const proj = geoMercator().fitExtent(
      [[PAD, PAD], [WIDTH - PAD, HEIGHT - PAD]],
      mainTarget,
    )
    const path = geoPath(proj as any)
    const d    = path(mainTarget) ?? ''
    const pts  = cities.map(c => {
      const xy = proj([c.lng, c.lat])
      return { city: c, x: xy ? xy[0] : 0, y: xy ? xy[1] : 0 }
    })
    // Chemins par pays "actif" (RELIGION) pour surbrillance
    const highlights: { iso: string; d: string }[] = []
    if (highlightIso3.size > 0) {
      for (const f of mainFeatures) {
        const iso = f?.properties?.iso
        if (iso && highlightIso3.has(iso)) {
          const fd = path(f) ?? ''
          if (fd) highlights.push({ iso, d: fd })
        }
      }
    }
    // Cartouche IDN/MYS/BRN : petite boîte en bas-droite (sous l'Inde)
    let insetD = ''
    let insetB: { x: number; y: number; w: number; h: number } | null = null
    if (isReligion) {
      const peripheralFeatures = allFeatures.filter((f) => PERIPH.has(f?.properties?.iso))
      if (peripheralFeatures.length > 0) {
        const box = { x: WIDTH - 88, y: HEIGHT - 64, w: 82, h: 58 }
        const periphColl = { type: 'FeatureCollection', features: peripheralFeatures }
        const insetProj = geoMercator().fitExtent(
          [[box.x + 2, box.y + 2], [box.x + box.w - 2, box.y + box.h - 2]],
          periphColl as any,
        )
        const insetPath = geoPath(insetProj as any)
        insetD = insetPath(periphColl as any) ?? ''
        insetB = box
      }
    }
    // viewBox serré au contour pour éviter les marges vides (Maroc portrait
     // dans un viewBox ~ carré laisse des bandes latérales vides). On reste
     // en boîte WIDTH×HEIGHT pour RELIGION (inset box bas-droite).
    let viewBox = `0 0 ${WIDTH} ${HEIGHT}`
    if (!isReligion) {
      try {
        const [[bx0, by0], [bx1, by1]] = path.bounds(mainTarget) as [[number, number], [number, number]]
        if (Number.isFinite(bx0) && Number.isFinite(by0) && Number.isFinite(bx1) && Number.isFinite(by1)) {
          const vx = bx0 - PAD, vy = by0 - PAD
          const vw = (bx1 - bx0) + 2 * PAD
          const vh = (by1 - by0) + 2 * PAD
          viewBox = `${vx} ${vy} ${vw} ${vh}`
        }
      } catch { /* fallback to full box */ }
    }
    return { outlineD: d, cityPoints: pts, highlightedPaths: highlights, insetOutlineD: insetD, insetBox: insetB, viewBox }
  }, [outline, cities, WIDTH, HEIGHT, highlightIso3, isReligion])

  const fullRouteD = useMemo(() => {
    if (cityPoints.length === 0) return ''
    return cityPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')
  }, [cityPoints])

  const visitedRouteD = useMemo(() => {
    const visitedPts: typeof cityPoints = []
    for (const p of cityPoints) {
      if (journey.visitedCityKeys.has(p.city.key)) visitedPts.push(p)
      else break // parcours linéaire → on s'arrête à la 1ère ville non visitée
    }
    if (journey.currentCityKey) {
      const curr = cityPoints.find(p => p.city.key === journey.currentCityKey)
      if (curr && !visitedPts.find(p => p.city.key === curr.city.key)) visitedPts.push(curr)
    }
    if (visitedPts.length < 2) return ''
    return visitedPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ')
  }, [cityPoints, journey])

  const currentPoint = cityPoints.find(p => p.city.key === journey.currentCityKey) ?? null

  const currentCity = journey.currentCityKey ? citiesByKey[journey.currentCityKey] ?? null : null
  const nextCity = useMemo<MapCity | null>(() => {
    if (!currentCity) return null
    const idx = citiesByOrder.findIndex(c => c.key === currentCity.key)
    if (idx < 0 || idx >= citiesByOrder.length - 1) return null
    return citiesByOrder[idx + 1]
  }, [currentCity, citiesByOrder])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        fontSize: 12, fontWeight: 900, color: 'var(--c-text)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6,
      }}>
        <span>{title}</span>
        {currentCity && (
          <span style={{
            color: 'var(--c-sub)', fontWeight: 700, textTransform: 'none', letterSpacing: 0,
          }}>
            : {journey.visitedCityKeys.size} / {cities.length} villes visitées
          </span>
        )}
      </div>

      <div style={{ fontSize: 11, color: 'var(--c-sub)', marginBottom: 10, lineHeight: 1.4 }}>
        {currentCity ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 18px' }}>
            <span>
              <span style={{ color: 'var(--c-sub)' }}>En visite : </span>
              <strong style={{ color: countryColor }}>{currentCity.nameFr}</strong>
            </span>
            {nextCity && (
              <span>
                <span style={{ color: 'var(--c-sub)' }}>Prochaine : </span>
                <strong style={{ color: 'var(--c-text)' }}>{nextCity.nameFr}</strong>
              </span>
            )}
          </div>
        ) : (
          `Départ : ${citiesByOrder[0]?.nameFr ?? ''}. ${cities.length} villes t'attendent !`
        )}
      </div>

      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <svg
          viewBox={viewBox}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <path
            d={outlineD}
            fill="none"
            stroke={countryColor}
            strokeWidth={1.2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {highlightedPaths.map(h => (
            <path
              key={h.iso}
              d={h.d}
              fill={`${countryColor}bb`}
              stroke={countryColor}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          ))}

          {insetBox && insetOutlineD && (
            <g>
              <rect
                x={insetBox.x} y={insetBox.y}
                width={insetBox.w} height={insetBox.h}
                fill="var(--c-bg)"
                stroke={countryColor}
                strokeOpacity={0.4}
                strokeWidth={0.6}
                strokeDasharray="2 2"
                rx={4}
              />
              <path
                d={insetOutlineD}
                fill="none"
                stroke={countryColor}
                strokeWidth={0.9}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.8}
              />
              <text
                x={insetBox.x + 4}
                y={insetBox.y + 9}
                fontSize={6.5}
                fontWeight={700}
                fill="var(--c-sub)"
                letterSpacing="0.06em"
              >
                ASIE DU SUD-EST
              </text>
            </g>
          )}

          {fullRouteD && (
            <path
              d={fullRouteD}
              fill="none"
              stroke={routeColor}
              strokeOpacity={0.8}
              strokeWidth={1.8}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          )}

          {visitedRouteD && (
            <path
              d={visitedRouteD}
              fill="none"
              stroke={routeColor}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {cityPoints.map(p => {
            const isVisited = journey.visitedCityKeys.has(p.city.key)
            const isCurrent = p.city.key === journey.currentCityKey
            const isHover   = hovered?.key === p.city.key
            const r = isCurrent ? 4 : isHover ? 3.2 : 2.4
            const fill = isCurrent ? countryColor : isVisited ? countryColor : 'rgba(120,120,120,0.55)'
            return (
              <g
                key={p.city.key}
                onMouseEnter={() => setHovered(p.city)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={p.x} cy={p.y} r={r + 4} fill="transparent"/>
                <circle cx={p.x} cy={p.y} r={r} fill={fill} stroke="white" strokeWidth={1}/>
              </g>
            )
          })}

          {currentPoint && (
            <g style={{ pointerEvents: 'none' }}>
              <circle cx={currentPoint.x} cy={currentPoint.y} r={9} fill={countryColor} opacity={0.25}>
                <animate attributeName="r" values="7;13;7" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx={currentPoint.x} cy={currentPoint.y} r={5} fill={countryColor} stroke="white" strokeWidth={1.5}/>
              {(() => {
                // Flippe le label sous le marqueur s'il n'a pas assez de place
                // au-dessus (halo de stroke + ascendeurs ~ 14 px à partir du viewBox top).
                const [vx, vy] = viewBox.split(' ').map(Number)
                void vx
                const clearanceAbove = currentPoint.y - vy
                const labelAbove = clearanceAbove > 22
                return (
                  <text
                    x={currentPoint.x}
                    y={labelAbove ? currentPoint.y - 12 : currentPoint.y + 18}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={900}
                    fill="#d4a84b"
                    stroke="var(--c-card)"
                    strokeWidth={3}
                    paintOrder="stroke"
                    letterSpacing="0.12em"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {currentPoint.city.nameFr.toUpperCase()}
                  </text>
                )
              })()}
            </g>
          )}
        </svg>

        {hovered && (() => {
          const hp = cityPoints.find(p => p.city.key === hovered.key)
          if (!hp) return null
          const [vx, vy, vw, vh] = viewBox.split(' ').map(Number)
          const leftPct = ((hp.x - vx) / vw) * 100
          const topPct  = ((hp.y - vy) / vh) * 100
          // Si la ville est dans la moitié haute, on place sous le marqueur
          const below = topPct < 40
          return (
            <div style={{
              position: 'absolute',
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: below
                ? 'translate(-50%, 14px)'
                : 'translate(-50%, calc(-100% - 14px))',
              background: 'var(--c-card2)',
              border: '1.5px solid var(--c-border-hard)',
              borderRadius: 10,
              padding: '6px 9px',
              fontSize: 11,
              lineHeight: 1.3,
              pointerEvents: 'none',
              maxWidth: 160,
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}>
              <div style={{ fontWeight: 900, color: 'var(--c-text)', fontSize: 12 }}>
                {hovered.nameFr}
              </div>
              <div style={{ color: countryColor, fontFamily: 'var(--font-amiri), serif', fontSize: 14, direction: 'rtl', margin: '2px 0' }}>
                {hovered.nameAr}
              </div>
              <div style={{ color: 'var(--c-sub)', fontSize: 10, fontStyle: 'italic' }}>
                {hovered.transliteration} · {hovered.sub}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
