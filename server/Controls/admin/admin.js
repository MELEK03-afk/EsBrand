import Category from "../../models/Category.js"
import Message from "../../models/Messages.js"
import Subcategory from "../../models/subcategory.js"
import Product from "../../models/Product.js"
import Cart from "../../models/Cart.js"


export const Messages = async(req,res)=>{    
    if (req.user.role !== "Owner" && req.user.role !== "Admin" ) {
        return res.status(500).json({message : "You don't have access to do that"})
    }
    try {
        const message= await Message.find()        
        return res.status(200).json(message)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}


export const AddCategory = async (req,res) => {
    const {name,slug,images} = req.body
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
            return res.status(500).json({message : "You don't have access to do that"})
    }
    try {
        if(!name) {
            return res.status(400).json({message : 'Category Name required'})
        }
        const exist = await Category.findOne({name})
        if (exist) {
            return res.status(400).json({message : 'Category Name existe'})
        }
        const imagePaths = req.files?.map(file=>file.path)
        const category = new Category({name,slug,images:imagePaths})
        await category.save()
        return res.status(200).json({ message : 'Field Created successfully'  ,category})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : 'Cannot add a new field'})

    }
}
export const getCategory = async(req,res)=>{    

    try {
        const category= await Category.find()        
        return res.status(200).json(category)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}
export const deleteCategory = async (req , res) => {
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
            return res.status(500).json({message : "You don't have access to do that"})
    }
    const { id } = req.params
    try {
        const category = await Category.findById(id)
        await category.deleteOne({_id : id})
        return res.status(200).json({message : 'User deleted'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal server error'})
    }
}
export const AddSubcategory = async (req, res) => {
    const { name, slug, categoryId,genre } = req.body;
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
        return res.status(500).json({ message: "You don't have access to do that" });
    }
    try {
        if (!name || !categoryId) {
            return res.status(400).json({ message: 'Fields required' });
        }
        const imagePath = req.file ? req.file.path : undefined;
        const subcategory = new Subcategory({ name, slug, categoryId, image: imagePath ,genre});
        await subcategory.save();
        return res.status(201).json({ message: 'Subcategory created successfully', subcategory });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Cannot add a new subcategory', error });
    }
}
export const getSubCategory = async(req,res)=>{    

    const {id}=req.params
    try {
        const subcategory= await Subcategory.find({ categoryId: id })     
        return res.status(200).json(subcategory)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}
export const deleSubCategory= async (req , res) => {
    if (req.user.role !== "Admin" && req.user.role !== "Owner") {
        return res.status(500).json({message : "You don't have access to do that"})
    }
    const { id } = req.params
    try {
        const subcategory = await Subcategory.findById(id)
        await subcategory.deleteOne({_id : id})
        return res.status(200).json({message : 'Subcategory deleted'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : 'Internal server error'})
    }
}
// Product

export const getProduct = async(req,res)=>{    
    const {id}=req.params
    try {
        const product= await Product.find({})     
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}


export const getProductById = async(req,res)=>{    
    const {id}=req.params
    try {
        const product= await Product.findById({_id:id}) 
        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}

export const AddProduct = async (req, res) => {
  const { name, price, categoryId, subcategoryId, size, genre, color, stock, isFeatured } = req.body;
  let parsedColor = color;
  try {
    if (typeof color === 'string') {
      parsedColor = JSON.parse(color);
    }
  } catch (parseError) {
    console.log("Error parsing color:", parseError);
  }
  const images = [];
  if (parsedColor && Array.isArray(parsedColor)) {
    for (const c of parsedColor) {
      const files = (req.files || []).filter(f => f.fieldname === `images[${c}][]`);
      const urls = files.map(f => f.path);
      images.push({ color: c, urls });
    }
  }
  try {
    const product = new Product({
      name,
      price,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      size: size || [],
      genre,
      color: parsedColor || [],
      stock: stock || 0,
      images,
      isFeatured: isFeatured || false
    });
    await product.save();
    return res.status(200).json({ message: 'Product Created successfully', product });
  } catch (error) {
    console.log("Error creating product:", error);
    return res.status(500).json({ message: 'Cannot add a new Product', error: error.message });
  }
};
export const UpdateProduct = async (req, res) => {
  const { name, price, categoryId, subcategoryId, size, genre, color, stock, isFeatured } = req.body;
  let parsedColor = color;
  try {
    if (typeof color === 'string') {
      parsedColor = JSON.parse(color);
    }
  } catch (parseError) {
    console.log("Error parsing color:", parseError);
  }
  const { id } = req.params;
  try {
    // Fetch current product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let currentImages = product.images || [];
    // Build new images array, merging existing and new
    const images = [];
    if (parsedColor && Array.isArray(parsedColor)) {
      for (const c of parsedColor) {
        // Existing images for this color sent from frontend
        let existing = req.body[`existingImages[${c}][]`] || [];
        if (typeof existing === 'string') existing = [existing];
        // New uploaded files for this color
        const files = (req.files || []).filter(f => f.fieldname === `images[${c}][]`);
        const newUrls = files.map(f => f.path);
        // Merge: keep only images that are in 'existing' or are new uploads
        // Find all current images for this color
        const currentColorObj = currentImages.find(img => img.color === c);
        let mergedUrls = [];
        if (currentColorObj) {
          // Only keep current images that are still in 'existing'
          mergedUrls = currentColorObj.urls.filter(url => existing.includes(url));
        }
        // Add new uploads
        mergedUrls = [...mergedUrls, ...newUrls];
        images.push({ color: c, urls: mergedUrls });
      }
    }
    // Update product
    product.name = name;
    product.price = price;
    product.categoryId = categoryId;
    product.subcategoryId = subcategoryId;
    product.size = size;
    product.genre = genre;
    product.color = parsedColor || [];
    product.stock = stock;
    product.images = images;
    product.isFeatured = isFeatured;
    await product.save();
    return res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.log("Error updating product:", error);
    return res.status(500).json({ message: 'Cannot update Product', error: error.message });
  }
};

export const getProductCart = async(req,res)=>{    
    const {id}=req.params
    try {
        const cart= await Cart.find({userId : id})     
        return res.status(200).json(cart)
    } catch (error) {
        console.log(error);
        return res.status(404).json({Message:"Internal server error",error})
    }
}