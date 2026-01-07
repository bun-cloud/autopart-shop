/**
 * druzroadstar shop - Main Application JavaScript
 * Features: Inventory database, smart search, cart management, filters
 */

// ========================================
// INVENTORY DATABASE
// ========================================
const inventoryDatabase = [
    // Brake System
    {
        id: 1,
        name: "Premium Ceramic Brake Pad Set",
        category: "Brake System",
        price: 45.99,
        brand: "Brembo",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='20' y='30' width='60' height='40' rx='5' fill='%234a4a4a'/%3E%3Crect x='25' y='35' width='50' height='30' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EBrake Pads%3C/text%3E%3C/svg%3E"],
        description: "High-performance ceramic brake pads designed for superior stopping power and reduced noise. Features low dust formulation for cleaner wheels."
    },
    {
        id: 2,
        name: "Vented Brake Disc Kit",
        category: "Brake System",
        price: 129.99,
        brand: "Brembo",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='35' fill='none' stroke='%234a4a4a' stroke-width='8'/%3E%3Ccircle cx='50' cy='50' r='15' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EBrake Disc%3C/text%3E%3C/svg%3E"],
        description: "Precision-machined vented brake discs with superior heat dissipation. Drilled and slotted design for improved braking performance in all conditions."
    },
    {
        id: 3,
        name: "Performance Brake Caliper",
        category: "Brake System",
        price: 89.99,
        brand: "Monroe",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='25' y='25' width='50' height='50' rx='8' fill='%234a4a4a'/%3E%3Crect x='30' y='30' width='40' height='40' rx='5' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ECaliper%3C/text%3E%3C/svg%3E"],
        description: "Premium brake caliper with stainless steel pistons. Features anti-rust coating and comes complete with mounting hardware."
    },
    
    // Filters
    {
        id: 4,
        name: "Premium Oil Filter",
        category: "Filters",
        price: 12.99,
        brand: "Bosch",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='30' y='20' width='40' height='60' rx='5' fill='%234a4a4a'/%3E%3Crect x='35' y='25' width='30' height='50' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='45' y='15' width='10' height='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EOil Filter%3C/text%3E%3C/svg%3E"],
        description: "High-capacity oil filter with premium filtration media. Traps contaminants effectively and ensures optimal engine protection."
    },
    {
        id: 5,
        name: "Cabin Air Filter with Activated Carbon",
        category: "Filters",
        price: 24.99,
        brand: "Bosch",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='15' y='35' width='70' height='30' rx='3' fill='%234a4a4a'/%3E%3Crect x='20' y='40' width='60' height='20' fill='%23CC5500' opacity='0.3'/%3E%3Cline x1='35' y1='40' x2='35' y2='60' stroke='%236a6a6a' stroke-width='2'/%3E%3Cline x1='50' y1='40' x2='50' y2='60' stroke='%236a6a6a' stroke-width='2'/%3E%3Cline x1='65' y1='40' x2='65' y2='60' stroke='%236a6a6a' stroke-width='2'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ECabin Filter%3C/text%3E%3C/svg%3E"],
        description: "Multi-layer cabin air filter with activated carbon technology. Removes allergens, dust, and odors for cleaner cabin air."
    },
    {
        id: 6,
        name: "High-Performance Air Intake Filter",
        category: "Filters",
        price: 34.99,
        brand: "K&N",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='45' r='30' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='45' r='22' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='45' r='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EAir Filter%3C/text%3E%3C/svg%3E"],
        description: "Washable and reusable high-flow air filter. Provides improved airflow and engine protection. Lifetime warranty included."
    },
    
    // Engine Parts
    {
        id: 7,
        name: "Iridium Spark Plug Set (4-Pack)",
        category: "Engine Parts",
        price: 39.99,
        brand: "NGK",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='25' y='20' width='10' height='60' rx='2' fill='%234a4a4a'/%3E%3Crect x='45' y='20' width='10' height='60' rx='2' fill='%234a4a4a'/%3E%3Crect x='65' y='20' width='10' height='60' rx='2' fill='%234a4a4a'/%3E%3Ccircle cx='30' cy='20' r='6' fill='%23CC5500' opacity='0.5'/%3E%3Ccircle cx='50' cy='20' r='6' fill='%23CC5500' opacity='0.5'/%3E%3Ccircle cx='70' cy='20' r='6' fill='%23CC5500' opacity='0.5'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ESpark Plugs%3C/text%3E%3C/svg%3E"],
        description: "Premium iridium spark plugs with trivalent metal plating. Provides excellent ignitability and extended service life up to 100,000 miles."
    },
    {
        id: 8,
        name: "Timing Belt Kit with Water Pump",
        category: "Engine Parts",
        partNumber: "ENG-TIM-002",
        price: 149.99,
        brand: "Gates",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%234a4a4a' stroke-width='12'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ETiming Belt%3C/text%3E%3C/svg%3E"],
        description: "Complete timing belt kit including tensioner, idler pulleys, and water pump. Designed for reliable performance and peace of mind."
    },
    {
        id: 9,
        name: "High-Volume Oil Pump",
        category: "Engine Parts",
        price: 79.99,
        brand: "Melling",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='20' y='30' width='60' height='40' rx='5' fill='%234a4a4a'/%3E%3Crect x='25' y='35' width='50' height='30' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='35' cy='50' r='8' fill='%236a6a6a'/%3E%3Ccircle cx='65' cy='50' r='8' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EOil Pump%3C/text%3E%3C/svg%3E"],
        description: "High-performance oil pump with increased flow rate. Features precision-machined components for reliable lubrication."
    },
    
    // Electrical
    {
        id: 10,
        name: "Premium AGM Car Battery",
        category: "Electrical",
        price: 199.99,
        brand: "DieHard",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='15' y='25' width='70' height='50' rx='5' fill='%234a4a4a'/%3E%3Crect x='20' y='30' width='60' height='40' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='22' y='32' width='25' height='36' fill='%236a6a6a'/%3E%3Crect x='53' y='32' width='25' height='36' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EBattery%3C/text%3E%3C/svg%3E"],
        description: "Absorbent Glass Mat (AGM) technology battery with 3-year free replacement warranty. Superior starting power and vibration resistance."
    },
    {
        id: 11,
        name: "Alternator - 160 Amp High Output",
        category: "Electrical",
        price: 189.99,
        brand: "Denso",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='50' r='22' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%236a6a6a'/%3E%3Ccircle cx='50' cy='25' r='5' fill='%23f5f5f5'/%3E%3Ccircle cx='75' cy='50' r='5' fill='%23f5f5f5'/%3E%3Ccircle cx='50' cy='75' r='5' fill='%23f5f5f5'/%3E%3Ccircle cx='25' cy='50' r='5' fill='%23f5f5f5'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EAlternator%3C/text%3E%3C/svg%3E"],
        description: "High-output 160 amp alternator for increased electrical demand vehicles. Features premium bearings and voltage regulation."
    },
    {
        id: 12,
        name: "LED Headlight Conversion Kit",
        category: "Electrical",
        price: 89.99,
        brand: "Philips",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='20' y='30' width='60' height='40' rx='8' fill='%234a4a4a'/%3E%3Crect x='25' y='35' width='50' height='30' rx='5' fill='%23CC5500' opacity='0.4'/%3E%3Cpath d='M30 50 L45 40 L45 60 Z' fill='%23f5f5f5' opacity='0.8'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ELED Lights%3C/text%3E%3C/svg%3E"],
        description: "Plug-and-play LED conversion kit with 12,000 lumens output. Features integrated cooling fan and 50,000 hour lifespan."
    },
    
    // Lighting
    {
        id: 13,
        name: "Halogen Headlight Bulb - H11",
        category: "Lighting",
        price: 24.99,
        brand: "Philips",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='30' y='20' width='40' height='60' rx='20' fill='%234a4a4a'/%3E%3Crect x='35' y='25' width='30' height='50' rx='17' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='43' y='75' width='14' height='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EHeadlight%3C/text%3E%3C/svg%3E"],
        description: "Premium halogen headlight bulb with up to 150% brighter light. CO+Blue coating for improved visibility and style."
    },
    {
        id: 14,
        name: "LED Tail Light Assembly",
        category: "Lighting",
        price: 159.99,
        brand: "Philips",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='15' y='30' width='70' height='40' rx='5' fill='%234a4a4a'/%3E%3Crect x='20' y='35' width='60' height='30' fill='%23CC5500' opacity='0.5'/%3E%3Crect x='25' y='40' width='15' height='20' fill='%23aa0000'/%3E%3Crect x='45' y='40' width='15' height='20' fill='%23aa0000'/%3E%3Crect x='60' y='40' width='15' height='20' fill='%23aa0000'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ETail Light%3C/text%3E%3C/svg%3E"],
        description: "LED tail light assembly with sequential turn signals. Direct bolt-on replacement with premium finish."
    },
    {
        id: 15,
        name: "Fog Light Kit - LED",
        category: "Lighting",
        price: 69.99,
        brand: "PIAA",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='25' y='25' width='50' height='50' rx='8' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23CC5500' opacity='0.4'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23f5f5f5' opacity='0.6'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EFog Light%3C/text%3E%3C/svg%3E"],
        description: "High-performance LED fog lights with yellow or white options. Impact-resistant polycarbonate lens."
    },
    
    // Suspension
    {
        id: 16,
        name: "Performance Strut Assembly",
        category: "Suspension",
        partNumber: "SUS-STR-001",
        price: 189.99,
        brand: "Monroe",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='40' y='15' width='20' height='70' rx='3' fill='%234a4a4a'/%3E%3Crect x='43' y='20' width='14' height='60' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='85' r='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EStrut%3C/text%3E%3C/svg%3E"],
        description: "Complete strut assembly with spring and mount. Designed for improved handling and ride comfort. Pre-assembled for easy installation."
    },
    {
        id: 17,
        name: "Sway Bar Link Kit",
        category: "Suspension",
        price: 54.99,
        brand: "Moog",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='15' y='45' width='70' height='10' rx='3' fill='%234a4a4a'/%3E%3Ccircle cx='25' cy='50' r='8' fill='%23CC5500' opacity='0.5'/%3E%3Ccircle cx='75' cy='50' r='8' fill='%23CC5500' opacity='0.5'/%3E%3Crect x='35' y='42' width='6' height='16' fill='%236a6a6a'/%3E%3Crect x='59' y='42' width='6' height='16' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3ESway Link%3C/text%3E%3C/svg%3E"],
        description: "Premium sway bar link kit with greasable joints. Features corrosion-resistant hardware and precise fitment."
    },
    {
        id: 18,
        name: "Shock Absorber Set",
        category: "Suspension",
        price: 129.99,
        brand: "KYB",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='35' y='15' width='12' height='70' fill='%234a4a4a'/%3E%3Crect x='38' y='20' width='6' height='60' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='53' y='15' width='12' height='70' fill='%234a4a4a'/%3E%3Crect x='56' y='20' width='6' height='60' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='41' cy='85' r='8' fill='%236a6a6a'/%3E%3Ccircle cx='59' cy='85' r='8' fill='%236a6a6a'/%3E%3Ctext x='50' y='95' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EShocks%3C/text%3E%3C/svg%3E"],
        description: "Pair of premium shock absorbers with gas charge technology. Provides consistent damping and improved stability."
    },
    
    // Additional items for variety
    {
        id: 19,
        name: "Ceramic Brake Disc Pad Set",
        category: "Brake System",
        price: 79.99,
        brand: "Bosch",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='15' y='35' width='35' height='30' rx='3' fill='%234a4a4a'/%3E%3Crect x='50' y='35' width='35' height='30' rx='3' fill='%234a4a4a'/%3E%3Crect x='18' y='38' width='29' height='24' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='53' y='38' width='29' height='24' fill='%23CC5500' opacity='0.3'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EBrake Kit%3C/text%3E%3C/svg%3E"],
        description: "Complete brake pad and rotor kit with hardware. Premium ceramic formula for low dust and quiet operation."
    },
    {
        id: 20,
        name: "Fuel Filter",
        category: "Filters",
        price: 18.99,
        brand: "Bosch",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='25' y='25' width='50' height='50' rx='8' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EFuel Filter%3C/text%3E%3C/svg%3E"],
        description: "High-efficiency fuel filter with premium filtration media. Protects fuel injectors and ensures optimal fuel flow."
    },
    {
        id: 21,
        name: "Ignition Coil Pack",
        category: "Engine Parts",
        price: 109.99,
        brand: "NGK",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='20' y='30' width='60' height='40' rx='5' fill='%234a4a4a'/%3E%3Crect x='25' y='35' width='50' height='30' fill='%23CC5500' opacity='0.3'/%3E%3Crect x='30' y='40' width='10' height='20' fill='%236a6a6a'/%3E%3Crect x='45' y='40' width='10' height='20' fill='%236a6a6a'/%3E%3Crect x='60' y='40' width='10' height='20' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EIgnition Coil%3C/text%3E%3C/svg%3E"],
        description: "Premium ignition coil pack with OE-matched design. Provides reliable spark for improved combustion and fuel economy."
    },
    {
        id: 22,
        name: "Power Steering Pump",
        category: "Engine Parts",
        price: 149.99,
        brand: "Cardone",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='45' r='28' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='45' r='18' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='45' r='8' fill='%236a6a6a'/%3E%3Crect x='70' y='40' width='15' height='10' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EPower Pump%3C/text%3E%3C/svg%3E"],
        description: "Remanufactured power steering pump with premium seals. Includes reservoir where applicable for complete replacement."
    },
    {
        id: 23,
        name: "Starter Motor - High Torque",
        category: "Electrical",
        price: 169.99,
        brand: "Denso",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Crect x='20' y='25' width='60' height='50' rx='5' fill='%234a4a4a'/%3E%3Crect x='25' y='30' width='50' height='40' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='40' cy='50' r='12' fill='%236a6a6a'/%3E%3Crect x='60' y='35' width='10' height='30' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EStarter%3C/text%3E%3C/svg%3E"],
        description: "High-torque starter motor for reliable starting in all conditions. Features premium bearings and solenoid."
    },
    {
        id: 24,
        name: "Control Arm Kit",
        category: "Suspension",
        price: 199.99,
        brand: "Moog",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Cpath d='M20 60 L50 30 L80 60' stroke='%234a4a4a' stroke-width='12' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='50' cy='30' r='8' fill='%23CC5500' opacity='0.5'/%3E%3Ccircle cx='20' cy='60' r='6' fill='%236a6a6a'/%3E%3Ccircle cx='80' cy='60' r='6' fill='%236a6a6a'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EControl Arm%3C/text%3E%3C/svg%3E"],
        description: "Complete control arm kit with ball joint and bushings. Precision-engineered for improved steering response and alignment."
    },
    {
        id: 25,
        name: "Wheel Hub Assembly",
        category: "Suspension",
        price: 119.99,
        brand: "Moog",

        images: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23242424' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='28' fill='%234a4a4a'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23CC5500' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%236a6a6a'/%3E%3Ccircle cx='50' cy='25' r='4' fill='%23f5f5f5'/%3E%3Ccircle cx='75' cy='50' r='4' fill='%23f5f5f5'/%3E%3Ccircle cx='50' cy='75' r='4' fill='%23f5f5f5'/%3E%3Ccircle cx='25' cy='50' r='4' fill='%23f5f5f5'/%3E%3Ctext x='50' y='90' text-anchor='middle' fill='%23f5f5f5' font-size='8' font-family='Arial'%3EHub Assembly%3C/text%3E%3C/svg%3E"],
        description: "Premium wheel hub assembly with integrated ABS sensor. Pre-adjusted bearings and seals for easy installation."
    }
];

// Vehicle data for smart filtering
const vehicleData = {
    Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
    Ford: ["F-150", "Mustang", "Explorer", "Escape", "Expedition"],
    Chevrolet: ["Silverado", "Camaro", "Equinox", "Tahoe", "Colorado"],
    BMW: ["3 Series", "5 Series", "X3", "X5", "X7"],
    Mercedes: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"]
};

// ========================================
// APPLICATION STATE
// ========================================
let inventory = [];
let currentProduct = null;

// ========================================
// INITIALIZATION
// ========================================
function initializeApp() {
    loadInventory();
    renderProducts();
    setupEventListeners();
}

function loadInventory() {
    const stored = localStorage.getItem('inventory_db');
    if (stored) {
        try {
            inventory = JSON.parse(stored);
            
            // Migrate old format to new format if needed
            if (inventory.length > 0 && inventory[0].hasOwnProperty('image') && !inventory[0].hasOwnProperty('images')) {
                inventory = inventory.map(product => ({
                    ...product,
                    images: [product.image]
                }));
                saveInventory();
            }
            
            // Ensure all products have the sold field
            let needsSave = false;
            inventory.forEach(product => {
                if (!product.hasOwnProperty('sold')) {
                    product.sold = false;
                    needsSave = true;
                }
            });
            if (needsSave) {
                saveInventory();
            }
        } catch (e) {
            console.error('Error parsing inventory from localStorage:', e);
            inventory = [...inventoryDatabase];
            saveInventory();
        }
    } else {
        inventory = [...inventoryDatabase];
        saveInventory();
    }
}

function saveInventory() {
    localStorage.setItem('inventory_db', JSON.stringify(inventory));
}

function resetDatabase() {
    // Clear localStorage and reload default inventory
    localStorage.removeItem('inventory_db');
    inventory = [...inventoryDatabase];
    saveInventory();
    renderProducts();
    showToast('Database reset to default inventory!');
}

// ========================================
// PRODUCT RENDERING
// ========================================
function renderProducts(products = inventory) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        resultsCount.textContent = '0 parts found';
        return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `${products.length} parts found`;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" onclick="showProductDetails(${product.id})">
                <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23242424%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%234a4a4a%22 font-size=%2240%22%3E%3F%3C/text%3E%3C/svg%3E'">
                ${product.sold ? '<span class="product-badge sold">SOLD</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="showProductDetails(${product.id})">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// SMART SEARCH & FILTERING
// ========================================
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = inventory;
    
    // Smart text search
    if (searchTerm) {
        filtered = filtered.filter(product => {
            const searchFields = [
                product.name,
                product.category,
                product.brand,
                product.description
            ].map(field => field.toLowerCase());
            
            return searchFields.some(field => field.includes(searchTerm));
        });
    }
    
    // Apply sorting
    const sortValue = document.getElementById('sortSelect').value;
    filtered = sortProducts(filtered, sortValue);
    
    renderProducts(filtered);
}

function sortProducts(products, sortValue) {
    const sorted = [...products];
    
    switch (sortValue) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// ========================================
// PRODUCT DETAILS MODAL
// ========================================
function showProductDetails(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('modalImage').src = product.images[0];
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalBrand').textContent = product.brand;
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Search
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Sort
    document.getElementById('sortSelect').addEventListener('change', performSearch);
    
    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('productModal')) {
            closeModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Make functions globally available
window.showProductDetails = showProductDetails;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
