import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";


const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, SetProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    SetProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    try {
      console.log("Product Details:", productDetails);

      // Step 1: Upload image
      let formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch("https://shoppyday-mern.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload response:", uploadData);

      if (!uploadData.success) {
        throw new Error("Image upload failed");
      }

      // Step 2: Add product
      let product = { ...productDetails, image: uploadData.imageUrl }; // Assuming the server returns 'imageUrl'

      const addProductResponse = await fetch(
        "https://shoppyday-mern.onrender.com/addproduct",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (!addProductResponse.ok) {
        throw new Error("Failed to add product");
      }

      const addProductData = await addProductResponse.json();
      console.log("Add product response:", addProductData);

      if (addProductData.success) {
        alert("Product Added");
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error in Add_Product:", error);
      alert("Failed to add product");
      // Handle errors here, such as showing a user-friendly message or logging
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product</p>
        <input
          type="text"
          value={productDetails.name}
          onChange={changeHandler}
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="text"
            value={productDetails.old_price}
            onChange={changeHandler}
            name="old_price"
            placeholder="Type Here"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="text"
            value={productDetails.new_price}
            onChange={changeHandler}
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumbnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_Product();
        }}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
