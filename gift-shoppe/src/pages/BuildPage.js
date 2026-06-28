import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import SeoHead from '../components/seo/SeoHead';
import { useCart } from '../context/CartContext';
import { calculateCustomBuildPrice } from '../utils/customBuildPricing';
import './BuildPage.css';

const BASE_ITEM_LABELS = {
  '3d-sphere': '3D Sphere Frame',
  'infinity-frame': 'Infinity Photo Frame',
  'mosaic-stand': 'Mosaic Stand',
  'premium-watch': 'Premium Watch',
};

const MATERIAL_LABELS = {
  wood: 'Premium Teak Wood',
  acrylic: 'Clear Acrylic',
  crystal: 'Solid Crystal',
  'gold-plated': '24k Gold Plated',
};

function BuildPage() {
  const [baseItem, setBaseItem] = useState('3d-sphere');
  const [material, setMaterial] = useState('wood');
  const [engravingName, setEngravingName] = useState('');
  const [fontFamily, setFontFamily] = useState("'Georgia', serif");
  const [textColor, setTextColor] = useState('#333333');
  const [showToast, setShowToast] = useState(false);
  const { addItem } = useCart();

  const totalPrice = calculateCustomBuildPrice({
    baseItem,
    material,
    engraving: engravingName,
  });

  const handleAddToCart = () => {
    const buildId = `custom-${Date.now()}`;
    addItem({
      id: buildId,
      type: 'custom',
      name: `Custom ${BASE_ITEM_LABELS[baseItem] || 'Gift'}`,
      price: totalPrice,
      quantity: 1,
      metadata: {
        baseItem,
        material,
        materialLabel: MATERIAL_LABELS[material] || material,
        engraving: engravingName || null,
        fontFamily,
        textColor,
      },
    });
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <section className="custom-builder-section">
      <SeoHead
        title="Custom Gift Builder"
        description="Design a bespoke GiftShoppe piece — choose your base item, premium materials, engraving, and typography."
        path="/build"
      />
      <div className="builder-container">
        <div className="builder-header">
          <h1>Bespoke Gift Studio</h1>
          <p>Design a truly unique piece with our custom gift builder.</p>
        </div>

        <div className="builder-content">
          <div className="builder-preview">
            <div className={`preview-canvas material-${material}`}>
              <span className="material-icons preview-icon" aria-hidden="true">
                {baseItem === 'premium-watch' ? 'watch' :
                  baseItem === 'infinity-frame' ? 'all_inclusive' :
                  baseItem === 'mosaic-stand' ? 'grid_view' : 'language'}
              </span>
              {engravingName && (
                <div
                  className="preview-engraving"
                  style={{ fontFamily: fontFamily, color: textColor }}
                >
                  {engravingName}
                </div>
              )}
            </div>
            <div className="preview-summary">
              <h2>Live Preview</h2>
              <p>Your custom configuration updates in real-time.</p>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {`${BASE_ITEM_LABELS[baseItem]}, ${MATERIAL_LABELS[material]}, ${engravingName ? `engraving ${engravingName}` : 'no engraving'}, estimated price ₹${totalPrice}`}
              </p>
            </div>
          </div>

          <div className="builder-controls">
            <div className="control-group">
              <label htmlFor="baseItem">1. Select Base Item</label>
              <div className="select-wrapper">
                <select
                  id="baseItem"
                  value={baseItem}
                  onChange={(e) => setBaseItem(e.target.value)}
                  className="premium-select"
                >
                  <option value="3d-sphere">3D Sphere Frame (₹500)</option>
                  <option value="infinity-frame">Infinity Photo Frame (₹600)</option>
                  <option value="mosaic-stand">Mosaic Stand (₹700)</option>
                  <option value="premium-watch">Premium Watch (₹1200)</option>
                </select>
                <span className="material-icons select-icon" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="material">2. Choose Material</label>
              <div className="select-wrapper">
                <select
                  id="material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="premium-select"
                >
                  <option value="wood">Premium Teak Wood (Standard)</option>
                  <option value="acrylic">Clear Acrylic (+20%)</option>
                  <option value="crystal">Solid Crystal (+50%)</option>
                  <option value="gold-plated">24k Gold Plated (+150%)</option>
                </select>
                <span className="material-icons select-icon" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="engraving">3. Personalised Engraving (+₹100)</label>
              <input
                type="text"
                id="engraving"
                placeholder="Enter name (Letters/Numbers only)"
                value={engravingName}
                onChange={(e) => {
                  const regexFiltered = e.target.value.replace(/[^a-zA-Z0-9 .,-]/g, '');
                  const deeplySanitized = DOMPurify.sanitize(regexFiltered);
                  setEngravingName(deeplySanitized);
                }}
                className="premium-input"
                maxLength={20}
              />
              <span className="char-count">{engravingName.length}/20</span>
            </div>

            <div className="control-group">
              <label htmlFor="fontFamily">4. Typography Style</label>
              <div className="select-wrapper">
                <select
                  id="fontFamily"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="premium-select"
                >
                  <option value="'Georgia', serif">Classic Serif (Georgia)</option>
                  <option value="'Inter', sans-serif">Modern Sans (Inter)</option>
                  <option value="'Great Vibes', cursive">Elegant Script (Great Vibes)</option>
                  <option value="'Courier New', monospace">Typewriter (Courier)</option>
                </select>
                <span className="material-icons select-icon" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="textColor">5. Engraving Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  id="textColor"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="color-input"
                  style={{ width: '100%', height: '50px', padding: '5px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>
            </div>

            <div className="builder-footer">
              <div className="price-display">
                <span className="price-label">Total Estimated Price</span>
                <span className="price-value">₹{totalPrice}</span>
              </div>
              <button
                type="button"
                className="add-to-cart-btn builder-btn"
                onClick={handleAddToCart}
                disabled={showToast}
                style={{ opacity: showToast ? 0.7 : 1, cursor: showToast ? 'not-allowed' : 'pointer' }}
              >
                {showToast ? 'Added to Cart' : 'Add Custom Build to Cart'}
              </button>
            </div>

            {showToast && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  animation: 'fadeIn 0.3s ease-in-out',
                }}
              >
                Item Successfully Added to Cart!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuildPage;
