export const products = [
  {
    id: 1,
    name: 'NPK 19-19-19 Premium Fertilizer',
    category: 'chemical',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    description: 'Balanced NPK fertilizer for all crops',
    cropTypes: ['Wheat', 'Rice', 'Corn', 'Cotton'],
    benefits: [
      'Promotes balanced growth',
      'Enhances root development',
      'Improves yield quality',
      'Increases resistance to diseases'
    ],
    uses: 'Apply during vegetative growth stage for optimal results',
    advantages: [
      'Water-soluble for easy application',
      'Quick absorption',
      'Suitable for all soil types',
      'Long-lasting effect'
    ],
    disadvantages: [
      'May require multiple applications',
      'Should be stored in dry place'
    ],
    nutrientComposition: {
      nitrogen: '19%',
      phosphorus: '19%',
      potassium: '19%',
      sulfur: '2%',
      micronutrients: 'Trace amounts'
    },
    dosage: '50-100 kg per hectare',
    methodOfUse: 'Broadcast or band placement',
    direction: 'Apply evenly across the field and mix with soil',
    recommendedCrops: ['Wheat', 'Rice', 'Corn', 'Cotton', 'Soybean'],
    applicationFrequency: 'Every 3-4 weeks during growing season',
    storageInstructions: 'Store in cool, dry place away from direct sunlight. Keep container tightly closed.',
    safetyPrecautions: [
      'Wear gloves and protective clothing',
      'Avoid contact with eyes and skin',
      'Wash hands after use',
      'Keep away from children and pets'
    ],
    warnings: 'Do not mix with other fertilizers without consulting an expert. Overuse may damage crops.',
    expiryDetails: 'Best before 24 months from manufacturing date',
    environmentalImpact: 'Use responsibly. Avoid application near water bodies. Follow recommended dosage to prevent soil degradation.'
  },
  {
    id: 2,
    name: 'Organic Compost Fertilizer',
    category: 'organic',
    price: 850,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    description: '100% organic compost for sustainable farming',
    cropTypes: ['Vegetables', 'Fruits', 'Flowers'],
    benefits: [
      'Improves soil structure',
      'Enhances water retention',
      'Promotes beneficial microorganisms',
      'Environmentally friendly'
    ],
    uses: 'Apply as top dressing or mix with soil before planting',
    advantages: [
      '100% organic and natural',
      'Improves soil health long-term',
      'Safe for environment',
      'No chemical residues'
    ],
    disadvantages: [
      'Slower release of nutrients',
      'May require larger quantities',
      'Needs regular application'
    ],
    nutrientComposition: {
      nitrogen: '2-3%',
      phosphorus: '1-2%',
      potassium: '1-2%',
      organicMatter: '40-50%',
      micronutrients: 'Various'
    },
    dosage: '2-5 tons per hectare',
    methodOfUse: 'Spread evenly and mix with topsoil',
    direction: 'Apply before planting or as top dressing during growth',
    recommendedCrops: ['Vegetables', 'Fruits', 'Flowers', 'Herbs'],
    applicationFrequency: 'Every 2-3 months',
    storageInstructions: 'Store in covered area. Keep moist but not wet. Protect from rain.',
    safetyPrecautions: [
      'Wear gloves during handling',
      'Wash hands after use',
      'Avoid inhaling dust'
    ],
    warnings: 'Ensure proper composting to avoid pathogens. Do not use if foul odor is present.',
    expiryDetails: 'Use within 6 months for best results',
    environmentalImpact: 'Highly beneficial for environment. Improves soil biodiversity and reduces need for chemical inputs.'
  },
  {
    id: 3,
    name: 'Urea 46-0-0 High Nitrogen',
    category: 'chemical',
    price: 950,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
    description: 'High nitrogen content for rapid vegetative growth',
    cropTypes: ['Rice', 'Wheat', 'Corn', 'Sugarcane'],
    benefits: [
      'Promotes rapid growth',
      'Enhances leaf development',
      'Increases protein content',
      'Cost-effective nitrogen source'
    ],
    uses: 'Apply during early growth stages for maximum effect',
    advantages: [
      'Highest nitrogen content',
      'Quickly available to plants',
      'Easy to apply',
      'Affordable price'
    ],
    disadvantages: [
      'Can volatilize if not properly applied',
      'May cause leaf burn if overused',
      'Requires proper timing'
    ],
    nutrientComposition: {
      nitrogen: '46%',
      phosphorus: '0%',
      potassium: '0%'
    },
    dosage: '100-150 kg per hectare',
    methodOfUse: 'Broadcast or side-dress application',
    direction: 'Apply when soil is moist and incorporate immediately',
    recommendedCrops: ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Barley'],
    applicationFrequency: '2-3 times during growing season',
    storageInstructions: 'Store in dry, well-ventilated area. Keep away from moisture. Use original packaging.',
    safetyPrecautions: [
      'Wear protective equipment',
      'Avoid dust inhalation',
      'Do not mix with seeds',
      'Keep away from water sources'
    ],
    warnings: 'Do not apply in excessive amounts. Can cause environmental pollution if misused.',
    expiryDetails: 'Best before 36 months from manufacturing date',
    environmentalImpact: 'Use carefully to prevent nitrogen leaching into groundwater. Follow recommended application rates.'
  },
  {
    id: 4,
    name: 'Vermicompost Premium',
    category: 'organic',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    description: 'Premium worm castings for superior soil health',
    cropTypes: ['Vegetables', 'Fruits', 'Flowers', 'Herbs'],
    benefits: [
      'Rich in beneficial microbes',
      'Improves soil aeration',
      'Enhances nutrient availability',
      'Stimulates plant growth'
    ],
    uses: 'Mix with potting soil or apply as top dressing',
    advantages: [
      'Superior nutrient content',
      'Improves soil structure',
      '100% organic',
      'Long-lasting benefits'
    ],
    disadvantages: [
      'Higher cost',
      'Limited availability',
      'Requires proper storage'
    ],
    nutrientComposition: {
      nitrogen: '1.5-2.5%',
      phosphorus: '1-2%',
      potassium: '1-2%',
      organicMatter: '50-60%',
      beneficialMicrobes: 'High'
    },
    dosage: '1-2 tons per hectare',
    methodOfUse: 'Mix with soil or apply as top dressing',
    direction: 'Apply evenly and water thoroughly after application',
    recommendedCrops: ['Vegetables', 'Fruits', 'Flowers', 'Herbs', 'Ornamentals'],
    applicationFrequency: 'Every 2-3 months',
    storageInstructions: 'Store in cool, shaded area. Keep slightly moist. Do not allow to dry completely.',
    safetyPrecautions: [
      'Wear gloves',
      'Wash hands after handling',
      'Avoid contact with eyes'
    ],
    warnings: 'Ensure product is fully composted. Do not use if strong ammonia smell is present.',
    expiryDetails: 'Use within 12 months for optimal microbial activity',
    environmentalImpact: 'Excellent for sustainable agriculture. Enhances soil ecosystem without negative impacts.'
  },
  {
    id: 5,
    name: 'DAP 18-46-0 Fertilizer',
    category: 'chemical',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    description: 'Diammonium Phosphate for root and flower development',
    cropTypes: ['Wheat', 'Rice', 'Corn', 'Cotton'],
    benefits: [
      'Promotes root development',
      'Enhances flowering',
      'Improves seed formation',
      'Quick phosphorus availability'
    ],
    uses: 'Apply at planting or early growth stage',
    advantages: [
      'High phosphorus content',
      'Water-soluble',
      'Quick action',
      'Suitable for various crops'
    ],
    disadvantages: [
      'Can increase soil pH',
      'May require additional nitrogen',
      'Should be applied carefully'
    ],
    nutrientComposition: {
      nitrogen: '18%',
      phosphorus: '46%',
      potassium: '0%'
    },
    dosage: '50-75 kg per hectare',
    methodOfUse: 'Band placement or broadcast',
    direction: 'Place near root zone for best results',
    recommendedCrops: ['Wheat', 'Rice', 'Corn', 'Cotton', 'Potato'],
    applicationFrequency: 'At planting and once during growth',
    storageInstructions: 'Store in dry place. Keep container sealed. Protect from moisture.',
    safetyPrecautions: [
      'Wear protective clothing',
      'Avoid dust inhalation',
      'Do not mix with alkaline materials',
      'Keep away from children'
    ],
    warnings: 'Do not apply in excessive amounts. Can cause root burn if placed too close to seeds.',
    expiryDetails: 'Best before 24 months from manufacturing date',
    environmentalImpact: 'Use responsibly to prevent phosphorus runoff into water bodies. Follow application guidelines.'
  },
  {
    id: 6,
    name: 'Seaweed Extract Fertilizer',
    category: 'organic-chemical',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400',
    description: 'Natural seaweed extract with growth hormones',
    cropTypes: ['Vegetables', 'Fruits', 'Flowers'],
    benefits: [
      'Contains natural growth hormones',
      'Improves stress tolerance',
      'Enhances fruit quality',
      'Boosts immunity'
    ],
    uses: 'Foliar spray or soil drench',
    advantages: [
      'Natural and organic',
      'Contains beneficial hormones',
      'Improves plant health',
      'Safe for all crops'
    ],
    disadvantages: [
      'Higher cost',
      'Requires regular application',
      'Limited shelf life'
    ],
    nutrientComposition: {
      nitrogen: '1-2%',
      phosphorus: '0.5-1%',
      potassium: '2-3%',
      organicMatter: '15-20%',
      growthHormones: 'Present'
    },
    dosage: '2-5 ml per liter of water',
    methodOfUse: 'Foliar spray or soil application',
    direction: 'Dilute in water and apply during early morning or evening',
    recommendedCrops: ['Vegetables', 'Fruits', 'Flowers', 'Ornamentals'],
    applicationFrequency: 'Every 2-3 weeks',
    storageInstructions: 'Store in cool, dark place. Keep bottle tightly closed. Use within 6 months after opening.',
    safetyPrecautions: [
      'Wear gloves',
      'Avoid contact with eyes',
      'Wash hands after use'
    ],
    warnings: 'Do not exceed recommended dosage. Store away from direct sunlight.',
    expiryDetails: 'Best before 18 months. Use within 6 months after opening.',
    environmentalImpact: 'Eco-friendly option. Derived from sustainable seaweed sources. No negative environmental impact.'
  }
]

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'organic', name: 'Organic' },
  { id: 'chemical', name: 'Chemical' },
  { id: 'organic-chemical', name: 'Organic-Chemical' }
]

export const cropTypes = [
  'Wheat',
  'Rice',
  'Corn',
  'Cotton',
  'Vegetables',
  'Fruits',
  'Flowers',
  'Sugarcane',
  'Soybean',
  'Potato',
  'Herbs'
]

