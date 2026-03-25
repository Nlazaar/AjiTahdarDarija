'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { getShopItems, getMyInventory, buyShopItem } from '@/lib/api';

type Category = 'all' | 'consumable' | 'cosmetic' | 'pack';

const CATEGORY_LABELS: Record<string, string> = {
  all: '🏪 Tout',
  consumable: '⚗️ Consommables',
  cosmetic: '🎨 Cosmétiques',
  pack: '📦 Packs',
};

const CATEGORY_COLORS: Record<string, string> = {
  consumable: '#ff6b35',
  cosmetic: '#7c3aed',
  pack: '#0ea5e9',
};

function GemIcon({ size = 16 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>💎</span>
  );
}

function ItemCard({
  item,
  owned,
  quantity,
  onBuy,
}: {
  item: any;
  owned: boolean;
  quantity: number;
  onBuy: () => void;
}) {
  const color = CATEGORY_COLORS[item.category] ?? '#111827';

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: `2px solid ${owned ? '#d1fae5' : '#f0f0f0'}`,
      overflow: 'hidden',
      boxShadow: owned ? '0 2px 12px rgba(16,185,129,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'transform 0.15s, box-shadow 0.15s',
      position: 'relative',
    }}>
      {/* Quantity badge */}
      {quantity > 1 && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: '#111827', color: 'white',
          fontSize: 11, fontWeight: 900, padding: '3px 8px',
          borderRadius: 8,
        }}>
          ×{quantity}
        </div>
      )}

      {/* Icon area */}
      <div style={{
        padding: '24px 20px 16px',
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        textAlign: 'center',
        borderBottom: `2px solid ${color}15`,
      }}>
        <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>{item.icon}</div>
        <div style={{
          display: 'inline-block',
          background: color + '20',
          color,
          fontSize: 10, fontWeight: 900,
          padding: '3px 10px', borderRadius: 6,
          textTransform: 'uppercase' as const, letterSpacing: '0.05em',
        }}>
          {item.category === 'consumable' ? 'Consommable' : item.category === 'cosmetic' ? 'Cosmétique' : 'Pack'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#111827', marginBottom: 4, lineHeight: 1.3 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, marginBottom: 14, minHeight: 36 }}>
          {item.description}
        </div>

        {owned ? (
          <div style={{
            width: '100%', padding: '10px', borderRadius: 12,
            background: '#d1fae5', border: '1.5px solid #6ee7b7',
            color: '#059669', fontSize: 12, fontWeight: 800, textAlign: 'center' as const,
          }}>
            ✓ Possédé
          </div>
        ) : (
          <button
            onClick={onBuy}
            style={{
              width: '100%', padding: '10px', borderRadius: 12, border: 'none',
              background: '#111827',
              color: 'white',
              fontSize: 13, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.15s',
            }}
          >
            <GemIcon size={14} />
            {item.price.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
}

// Confirmation modal
function ConfirmModal({
  item,
  gemmes,
  onConfirm,
  onCancel,
  loading,
}: {
  item: any;
  gemmes: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const canAfford = gemmes >= item.price;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, padding: '28px 24px',
          width: '100%', maxWidth: 360,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          textAlign: 'center' as const,
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>{item.icon}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#111827', marginBottom: 6 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
          {item.description}
        </div>

        {/* Price row */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
          background: canAfford ? '#f0fdf4' : '#fef2f2',
          border: `1.5px solid ${canAfford ? '#86efac' : '#fca5a5'}`,
          borderRadius: 14, padding: '12px 20px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Ton solde :</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, fontWeight: 900, color: '#0ea5e9' }}>
            <GemIcon /> {gemmes.toLocaleString()}
          </div>
          <div style={{ color: '#d1d5db' }}>→</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, fontWeight: 900, color: canAfford ? '#059669' : '#dc2626' }}>
            <GemIcon /> {Math.max(0, gemmes - item.price).toLocaleString()}
          </div>
        </div>

        {!canAfford && (
          <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 16 }}>
            Gemmes insuffisantes — il te manque {(item.price - gemmes).toLocaleString()} 💎
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '13px', borderRadius: 14,
            border: '2px solid #e5e7eb', background: 'white',
            color: '#6b7280', fontSize: 14, fontWeight: 800, cursor: 'pointer',
          }}>
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || loading}
            style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: canAfford && !loading ? '#111827' : '#f3f4f6',
              color: canAfford && !loading ? 'white' : '#9ca3af',
              fontSize: 14, fontWeight: 800, cursor: canAfford && !loading ? 'pointer' : 'default',
            }}
          >
            {loading ? '…' : 'Acheter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { progress, addGemmes, syncFromBackend } = useUserProgress();

  const [items,     setItems]     = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [category,  setCategory]  = useState<Category>('all');
  const [loading,   setLoading]   = useState(true);
  const [confirm,   setConfirm]   = useState<any | null>(null);
  const [buying,    setBuying]    = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  const gemmes = progress.gemmes;

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.allSettled([getShopItems(), getMyInventory()]).then(([i, inv]) => {
      if (i.status === 'fulfilled' && Array.isArray(i.value)) setItems(i.value);
      if (inv.status === 'fulfilled' && Array.isArray(inv.value)) setInventory(inv.value);
      setLoading(false);
    });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Map inventory for quick lookup
  const inventoryMap = new Map(inventory.map((i) => [i.itemKey, i.quantity]));

  const filteredItems = category === 'all' ? items : items.filter((i) => i.category === category);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = async () => {
    if (!confirm) return;
    setBuying(true);
    try {
      const res = await buyShopItem(confirm.key);
      if (res.success) {
        // Update local gemmes
        addGemmes(-(confirm.price));
        await syncFromBackend();
        loadData();
        showToast(`${confirm.icon} ${confirm.name} acheté !`, true);
      }
    } catch (e: any) {
      const msg = e?.message?.includes('insuffisantes') ? 'Gemmes insuffisantes !' : "Erreur lors de l'achat.";
      showToast(msg, false);
    }
    setBuying(false);
    setConfirm(null);
  };

  const categories: Category[] = ['all', 'consumable', 'cosmetic', 'pack'];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 4 }}>Boutique</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>
          Dépense tes gemmes pour booster ton apprentissage
        </p>

        {/* Gemmes balance */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'white', border: '2px solid #bae6fd',
          borderRadius: 16, padding: '10px 20px',
          boxShadow: '0 2px 8px rgba(14,165,233,0.1)',
        }}>
          <span style={{ fontSize: 22 }}>💎</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0ea5e9', lineHeight: 1 }}>
              {gemmes.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', marginTop: 1 }}>GEMMES</div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, borderLeft: '1.5px solid #e0f2fe', paddingLeft: 10 }}>
            Gagnées en complétant<br />des leçons
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '9px 14px', borderRadius: 14, border: 'none',
            background: category === cat ? '#111827' : '#f3f4f6',
            color: category === cat ? 'white' : '#6b7280',
            fontSize: 12, fontWeight: 800, cursor: 'pointer',
            whiteSpace: 'nowrap' as const, transition: 'all 0.15s', flexShrink: 0,
          }}>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>Chargement…</div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏪</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#374151' }}>Aucun article disponible</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {filteredItems.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              owned={inventoryMap.has(item.key) && item.category === 'cosmetic'}
              quantity={inventoryMap.get(item.key) ?? 0}
              onBuy={() => setConfirm(item)}
            />
          ))}
        </div>
      )}

      {/* Info card */}
      <div style={{
        marginTop: 24, background: 'white', borderRadius: 18, padding: '16px 20px',
        border: '2px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111827', marginBottom: 3 }}>
            Comment gagner des gemmes ?
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
            Tu gagnes <strong>15 gemmes</strong> à chaque leçon complétée (score ≥ 60%).
            Continue à apprendre pour remplir ta cagnotte !
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          item={confirm}
          gemmes={gemmes}
          onConfirm={handleBuy}
          onCancel={() => setConfirm(null)}
          loading={buying}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: toast.ok ? '#111827' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: 14,
          fontSize: 13, fontWeight: 800, zIndex: 2000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap' as const,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
