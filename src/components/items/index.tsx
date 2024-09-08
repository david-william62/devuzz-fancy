import { appwrite } from "../../lib";
import { useEffect, useState } from "react";

interface Item {
  name: string;
  price: number;
  image: string;
}

function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading

  const getData = async () => {
    try {
      const itemList = await appwrite.getitems();

      // Create an array of promises for image loading
      const imageLoadPromises = itemList.map(
        (item) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = item.image;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false); // Resolve even if there's an error to avoid blocking
          })
      );

      await Promise.all(imageLoadPromises);

      setItems(itemList);
      setLoading(false); // Set loading to false when all images are loaded
    } catch (error) {
      console.error("Failed to fetch items", error);
      setLoading(false); // Also stop loading on error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <img src={item.image} alt={item.name} width="100" height="100" />
              <strong>{item.name}</strong> - ${item.price}
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
