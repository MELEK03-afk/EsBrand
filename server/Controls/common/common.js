import User from "../../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cart from "../../models/Cart.js"
import Abonne from "../../models/Abonne.js"
import validator from 'validator'



export const singUp = async(req,res)=>{
    
    const {email,password,phoneNumber}=req.body
    try {

        if( !email || !password ){
            return res.status(400).json({Message:"All files are required"})
        }
        const exist2= await User.findOne({phoneNumber})
        if (exist2) {
            return res.status(400).json({ message: "Cette Number est déjà utilisée" });
        }
        const exist= await User.findOne({email})
        if (exist) {
            return res.status(400).json({ message: "Cette adresse e-mail est déjà utilisée" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Wrong E-mail" });
        }
          
        if (!validator.isLength(password, { min: 5 })) {
            return res.status(400).json({ message: "Wrong Password (min 5 characters)" });
        }
        const HashedPassword= await bcrypt.hash(password,10)
        const newuser= new User({email,password:HashedPassword,phoneNumber})
        await newuser.save()
       return res.status(201).json({
            id : newuser._id,
            email :newuser.email,
            phoneNumber: newuser.phoneNumber,
            token : GenerateToken(newuser._id),
            role : 'User',
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
      }


}

export const singIn = async (req, res) => {
    const {email , password} = req.body
    try {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Wrong E-mail" });
      }
      
      if (!validator.isLength(password, { min: 5 })) {
        return res.status(400).json({ message: "Wrong Password (min 5 characters)" });
      }
        const user = await User.findOne({ email })
        if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
          
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        if (isMatch && user) {
            return res.status(200).json({
              id : user._id,
              email :user.email,
              fullName : user.fullName,
              phoneNumber: user.phoneNumber,
              token : GenerateToken(user._id),
              role : user.role,
          })
        }
    } catch (error) {
      console.log(error)
       return res.status(500).json({ message: "Internal Server Error" });

    }
};


// Cart functionality
export const addToCart = async (req, res) => {
    try {
        const { userId, products } = req.body;
        
        if (!userId || !products || !Array.isArray(products)) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Check if user already has a cart
        let cart = await Cart.findOne({ userId });
        
        if (cart) {
            // Update existing cart
            for (const newProduct of products) {
                const existingProductIndex = cart.products.findIndex(
                    p => p.productId.toString() === newProduct.productId && 
                         p.size === newProduct.size && 
                         p.color === newProduct.color
                );
                
                if (existingProductIndex !== -1) {
                    // Update quantity if same product, size, and color
                    cart.products[existingProductIndex].quantity += newProduct.quantity;
                } else {
                    // Add new product
                    cart.products.push(newProduct);
                }
            }
        } else {
            // Create new cart
            cart = new Cart({ userId, products });
        }
        
        cart.updatedAt = new Date();
        await cart.save();
        
        return res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        
        if (!cart) {
            return res.status(200).json({ cart: { products: [] } });
        }
        
        return res.status(200).json({ cart });
    } catch (error) {
        console.error('Error getting cart:', error);
        return res.status(500).json({ message: 'Failed to get cart' });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, size, color, quantity } = req.body;
        
        if (!userId || !productId || !size || !color || quantity === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const productIndex = cart.products.findIndex(
            p => p.productId.toString() === productId && 
                 p.size === size && 
                 p.color === color
        );
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        
        if (quantity <= 0) {
            // Remove product if quantity is 0 or negative
            cart.products.splice(productIndex, 1);
        } else {
            // Update quantity
            cart.products[productIndex].quantity = quantity;
        }
        
        cart.updatedAt = new Date();
        await cart.save();
        
        return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: 'Failed to update cart' });
    }
};

export const removeFromCart = async (req, res) => {
    const { userId, productId, size, color } = req.body;
    console.log(userId);
    console.log(productId);
    console.log(size);
    console.log(color);
    
    try {
        
        if (!userId || !productId || !size || !color) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.products = cart.products.filter(
            p => !(p.productId.toString() === productId && 
                   p.size === size && 
                   p.color === color)
        );
        
        cart.updatedAt = new Date();
        await cart.save();
        
        return res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({ message: 'Failed to remove product from cart' });
    }
};

export const Subscribe = async(req,res)=>{
    const {email}=req.body
    console.log(email);
    
    try {
        if( !email ){
            return res.status(400).json({Message:"Email files are required"})
        }
        const exist= await Abonne.findOne({email})
        if (exist) {
            return res.status(400).json({ message: "Cette adresse e-mail est déjà utilisée" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Wrong E-mail" });
        }
          
        const newSubscribe= new Abonne({email})
        await newSubscribe.save()
       return res.status(201).json({Message:"Successfuly Subscribe"})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
      }


}

const GenerateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_secret,{expiresIn:"15d"})
}