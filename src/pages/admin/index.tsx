import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appwrite } from "../../lib";
import "./index.css";

function Admin() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await appwrite.account.get();
        const isAdmin = await appwrite.checkAdminPrivileges(user.$id);
        console.log(isAdmin);
        if (!isAdmin) {
          navigate("/");
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/"); // Redirect if not authenticated
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Create a FileReader to show a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !name || !price) {
      setError("All fields are required.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await appwrite.uploadItem(name, parseFloat(price), file);

      console.log("Item uploaded successfully:", response);

      setUploading(false);
      setProgress(0);
      setFile(null);
      setPreview(null);
      setName("");
      setPrice("");
    } catch (error) {
      setUploading(false);
      setError("An error occurred while uploading.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await appwrite.logout();
  };

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-wrapper">
      <div className="upload-ui">
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
        <input
          type="file"
          name="image"
          id="inp1"
          placeholder="Upload image"
          onChange={handleFileChange}
        />
        <input
          type="text"
          name="Name"
          id="inp2"
          placeholder="Name of item"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="Price"
          id="inp3"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-btn"
        >
          {uploading ? `Uploading... ${Math.round(progress)}%` : "Upload Item"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
}

export { Admin };
