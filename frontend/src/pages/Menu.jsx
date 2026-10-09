const menuSections = [
  {
    title: "Starters",
    items: [
      {
        name: "Bruschetta",
        description:
          "Fresh tomatoes, basil, olive oil, and toasted baguette slices",
        price: "$8.50",
      },
      {
        name: "Caesar Salad",
        description: "Crisp romaine with homemade Caesar dressing",
        price: "$9.00",
      },
    ],
  },
  {
    title: "Main Courses",
    items: [
      {
        name: "Grilled Salmon",
        description: "Served with lemon butter sauce and seasonal vegetables",
        price: "$22.00",
      },
      {
        name: "Ribeye Steak",
        description: "12 oz prime cut with garlic mashed potatoes",
        price: "$28.00",
      },
      {
        name: "Vegetable Risotto",
        description: "Creamy Arborio rice with wild mushrooms",
        price: "$18.00",
      },
    ],
  },
  {
    title: "Desserts",
    items: [
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with mascarpone",
        price: "$7.50",
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake with berry compote",
        price: "$7.00",
      },
    ],
  },
  {
    title: "Beverages",
    items: [
      {
        name: "Red Wine (Glass)",
        description: "A selection of Italian reds",
        price: "$10.00",
      },
      {
        name: "White Wine (Glass)",
        description: "Crisp and refreshing",
        price: "$9.00",
      },
      {
        name: "Craft Beer",
        description: "Local artisan brews",
        price: "$6.00",
      },
      {
        name: "Espresso",
        description: "Strong and aromatic",
        price: "$3.00",
      },
    ],
  },
];

function Menu() {
  return (
    <main className="menu-page">

      <section className="page-header">
        <p className="eyebrow dark-eyebrow">
          Café Fausse
        </p>

        <h1>Our Menu</h1>

        <p>
          Traditional Italian flavors meet modern culinary innovation.
        </p>
      </section>

      <section className="menu-container">
        {menuSections.map((section) => (
          <div className="menu-section" key={section.title}>

            <h2>{section.title}</h2>

            {section.items.map((item) => (
              <div className="menu-item" key={item.name}>

                <div className="menu-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>

                <span className="menu-price">
                  {item.price}
                </span>

              </div>
            ))}

          </div>
        ))}
      </section>

    </main>
  );
}

export default Menu;