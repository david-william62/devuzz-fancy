import { appwrite } from "../../lib";
import { useEffect, useState } from "react";
import "./index.css";

interface Item {
  name: string;
  price: number;
  image: string;
}

function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      const itemList = await appwrite.getitems();
      const imageLoadPromises = itemList.map(
        (item) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = item.image;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
          })
      );
      await Promise.all(imageLoadPromises);
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
              <img src={item.image} alt={item.name} width="100" height="100" />
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
