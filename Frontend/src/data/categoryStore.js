const STORAGE_KEY = "admin_categories";

const defaultCategories = [
  {
    id: 1,
    name: "Electronics",
    subCategory: ["Mobiles", "Laptops", "Accessories"],
    createdAt: "15 Apr 2026",
  },
  {
    id: 2,
    name: "Fashion",
    subCategory: ["Men", "Women", "Kids Wear"],
    createdAt: "13 Apr 2026",
  },
  {
    id: 3,
    name: "Home Decor",
    subCategory: ["Lighting", "Wall Art", "Furnishing"],
    createdAt: "11 Apr 2026",
  },
  {
    id: 4,
    name: "Beauty",
    subCategory: ["Skin Care", "Hair Care", "Makeup"],
    createdAt: "09 Apr 2026",
  },
  {
    id: 5,
    name: "Sports",
    subCategory: ["Fitness", "Outdoor", "Indoor Games"],
    createdAt: "07 Apr 2026",
  },
  {
    id: 6,
    name: "Books",
    subCategory: ["Fiction", "Academic", "Self Help"],
    createdAt: "05 Apr 2026",
  },
  {
    id: 7,
    name: "Groceries",
    subCategory: ["Daily Essentials", "Snacks", "Beverages"],
    createdAt: "03 Apr 2026",
  },
  {
    id: 8,
    name: "Furniture",
    subCategory: ["Living Room", "Bedroom", "Office"],
    createdAt: "01 Apr 2026",
  },
];

function readCategories() {
  if (typeof window === "undefined") {
    return defaultCategories;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
}

function writeCategories(categories) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
}

export function getCategories() {
  return readCategories();
}

export function getCategoryById(id) {
  return readCategories().find((item) => item.id === Number(id)) ?? null;
}

export function createCategory({ categoryName, subCategory }) {
  const categories = readCategories();
  const newCategory = {
    id: categories.length > 0 ? Math.max(...categories.map((item) => item.id)) + 1 : 1,
    name: categoryName,
    subCategory,
    createdAt: "16 Apr 2026",
  };

  const nextCategories = [newCategory, ...categories];
  writeCategories(nextCategories);
  return newCategory;
}

export function updateCategory(id, { categoryName, subCategory }) {
  const nextCategories = readCategories().map((item) =>
    item.id === Number(id)
      ? {
          ...item,
          name: categoryName,
          subCategory,
        }
      : item
  );

  writeCategories(nextCategories);
  return nextCategories.find((item) => item.id === Number(id)) ?? null;
}

export function deleteCategory(id) {
  const nextCategories = readCategories().filter(
    (item) => item.id !== Number(id)
  );

  writeCategories(nextCategories);
  return nextCategories;
}
