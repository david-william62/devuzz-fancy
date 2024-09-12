import { appwrite } from "../../lib";
import { useEffect, useState } from "react";
import "./index.css";

interface Item {
  name: string;
  price: number;
  image: string;
}

const CACHE_KEY = "cached_items";

function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setItems(JSON.parse(cachedData));
      setLoading(false);
      return;
    }
    try {
      const itemList = await appwrite.getitems();
      // Store items in cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(itemList));
      setItems(itemList);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch items", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1 className="prodTitle">Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length > 0 ? (
        <ul className="prods">
          {items.map((item) => (
            <li key={item.name}>
              <img
                src={item.image}
                alt={item.name}
                width="100"
                height="100"
                loading="lazy"
              />
              <h3>
                <strong>{item.name}</strong> - ${item.price}
              </h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items available</p>
      )}
    </div>
  );
}

export { Items };
