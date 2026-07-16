import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, MENU_ITEMS } from '@kopi-senja/shared';

export default function MenuTab() {
  const { selectedCategory, setSelectedCategory, addToCart } = useApp();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Filter items based on active selection
  const filteredItems = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  // Group items by category to render sections nicely if 'all' is selected
  const categoriesToRender = selectedCategory === 'all'
    ? CATEGORIES.filter(c => c.id !== 'all')
    : CATEGORIES.filter(c => c.id === selectedCategory);

  return (
    <div className="space-y-12">
      
      {/* Welcome Hero Section */}
      <section className="mb-12 md:mb-20 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-4">
          <span className="font-vietnam text-xs font-bold text-secondary uppercase tracking-widest">
            The Artisanal Experience
          </span>
          <h2 className="font-garamond text-display-lg-mobile md:text-display-lg text-primary leading-tight font-semibold">
            Your morning ritual, <br />perfected at sunset.
          </h2>
          <p className="text-on-surface-variant max-w-xl font-vietnam text-base leading-relaxed">
            Each cup is a labor of patience, from bean selection to the final pour. 
            Discover our curated selection of roasts and handmade pastries.
          </p>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500 group">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMa_6hd6Vq22HW1Gqj1eL12LlAggAA1ch0Ped8sAjT4sl_SKDouESt8C5HGx6_eJ8O3Amx3nSVuKbu3W2rwv2FyH7fX90quhQ5a6IxdebwMp8zepYBn2GGwAluL31nLsCyhDS0hv1bV93GMkiLHnjMAmNsA9Yasv4UJjzE-OOJj9G4-7A3c2XJ2qwW5gXGFZ_Nrh5Yl5aug6QZqchqusUmTBei5i-yw1sPw7CAuIyiLvw9-IN3DkJhPv65E7cgvZtjvJuqRYPksE" 
              alt="Artisanal Cafe Interior Golden Hour"
            />
          </div>
          
          {/* Floating Award Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined fill-icon">stars</span>
              </div>
              <div>
                <p className="font-vietnam text-sm font-bold text-primary">Award Winning</p>
                <p className="text-xs text-on-surface-variant font-vietnam">Roast of the Year 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar border-b border-outline-variant/10">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`cursor-pointer px-6 py-2 rounded-full font-vietnam font-semibold transition-all duration-300 whitespace-nowrap active:scale-95 ${
              selectedCategory === category.id
                ? 'bg-secondary text-on-secondary shadow-md'
                : 'bg-primary/5 text-on-surface-variant hover:bg-primary/10'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Dynamic Sections Grid */}
      <div className="space-y-16">
        {categoriesToRender.map((category) => {
          const categoryItems = filteredItems.filter(item => item.category === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} className="scroll-mt-20">
              {/* Category Header */}
              <div className="flex items-baseline justify-between mb-8 border-b border-outline-variant/20 pb-4">
                <h3 className="font-garamond text-2xl md:text-3xl text-primary capitalize font-medium">
                  {category.name}
                </h3>
                <span className="text-on-surface-variant font-vietnam text-xs font-bold uppercase tracking-wider">
                  {category.id === 'coffee' ? 'Freshly Roasted' : 'Curated Selection'}
                </span>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-surface rounded-xl overflow-hidden border border-outline-variant/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Area */}
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        src={item.image} 
                        alt={item.name} 
                      />
                      
                      {/* Price Tag Overlay */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs">
                        <span className="font-vietnam font-bold text-secondary text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Information Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-vietnam font-semibold text-primary text-lg">
                            {item.name}
                          </h4>
                        </div>
                        
                        {/* Custom Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-2">
                            {item.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="bg-secondary/5 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-on-surface-variant font-vietnam text-sm leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Flavor Bar / Specialty Gauge */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider">
                          <span>{item.flavorLabel}</span>
                          <span>{item.flavorValue}%</span>
                        </div>
                        <div className="flavor-bar-segment">
                          <div 
                            className="flavor-bar-fill" 
                            style={{ width: `${item.flavorValue}%` }}
                          />
                        </div>
                      </div>

                      {/* Add Button */}
                      <button 
                        onClick={() => addToCart(item)}
                        className="cursor-pointer w-full bg-secondary text-on-secondary font-bold py-3.5 rounded-lg flex items-center justify-center space-x-2 btn-press transition-colors hover:bg-on-secondary-fixed-variant"
                      >
                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                        <span className="font-vietnam">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
}
