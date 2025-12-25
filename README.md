# Fertilizer Shop - Frontend

A modern, responsive e-commerce website for a fertilizer shop built with React, Vite, and Tailwind CSS.

## Features

- **Home Page**: Featured products, seasonal offers, and category browsing
- **Product Listing**: Advanced filtering and sorting by category, crop type, and price
- **Product Details**: Comprehensive product information including:
  - Benefits and uses
  - Advantages and disadvantages
  - Nutrient composition
  - Usage instructions (dosage, method, direction)
  - Recommended crops
  - Application frequency
  - Storage instructions
  - Safety precautions and warnings
  - Expiry details
  - Environmental impact
- **Shopping Cart**: Add, remove, and manage products
- **Checkout**: Multi-step checkout with delivery and payment options
- **User Account**: Profile management, order history, and saved addresses

## Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx   # Navigation header with search and cart
│   └── Footer.jsx   # Footer with contact info and links
├── pages/           # Page components
│   ├── Home.jsx     # Home page
│   ├── Products.jsx # Product listing with filters
│   ├── ProductDetail.jsx # Detailed product page
│   ├── Cart.jsx     # Shopping cart
│   ├── Checkout.jsx # Checkout process
│   └── Account.jsx  # User account management
├── context/         # React context providers
│   └── CartContext.jsx # Shopping cart state management
├── data/            # Static data
│   └── products.js  # Product data
├── App.jsx          # Main app component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Features Overview

### Header
- Logo and brand name
- Navigation menu (Home, Products, Categories)
- Search bar
- User account link
- Shopping cart with item count

### Footer
- Company information
- Contact details (address, phone, email)
- Social media links
- Policy links (Privacy, Terms, Shipping, Returns)
- Support links (FAQ, Contact, About, Careers)

### Home Page
- Hero section with call-to-action
- Category browsing cards
- Featured products showcase
- Seasonal offers section
- Why choose us section

### Products Page
- Filter by category (Organic, Chemical, Organic-Chemical)
- Filter by crop type
- Filter by price range
- Sort by price or name
- Responsive grid layout
- Quick add to cart

### Product Detail Page
- Large product image
- Product information tabs:
  - Overview (advantages/disadvantages)
  - Benefits & Uses
  - Nutrient Composition
  - Usage Instructions
  - Safety & Storage
- Quantity selector
- Add to cart functionality

### Cart Page
- Product list with images
- Quantity adjustment
- Remove items
- Order summary with totals
- Proceed to checkout

### Checkout Page
- Multi-step process:
  1. Delivery information
  2. Payment information
  3. Order review
- Delivery method selection
- Payment method selection (Card/Cash on Delivery)
- Order summary sidebar

### Account Page
- Profile management (editable)
- Order history
- Saved addresses management
- Set default address

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme. The primary color is set to green (fertilizer theme).

### Products
Add or modify products in `src/data/products.js`. Each product includes comprehensive information as specified.

### Styling
All styling uses Tailwind CSS utility classes. Modify components directly or extend the Tailwind config.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

