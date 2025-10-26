import React,{useState,useEffect,useMemo} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import {ShoppingBag,Truck,ChevronDown,ChevronUp   } from 'lucide-react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const CommandeComp = () => {
const [value, setValue] = useState(""); // you can remove this if unused
const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [email, setEmail] = useState("");
const [telephone, setTelephone] = useState("");
const [rue, setRue] = useState("");
const [ville, setVille] = useState(""); // ✅ fixed lowercase setter
const [complement, setComplement] = useState(""); // ✅ added
const [postal, setPostal] = useState(""); // ✅ added
const navigate=useNavigate()

const provinces = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const [open, setOpen] = useState(false);
const [province, setprovince] = useState("");
const [selected, setSelected] = useState("Province");
const [productCart, setProductCart] = useState([]);
const [user, setUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
})
const filteredProvinces = provinces.filter((prov) =>
  prov.toLowerCase().includes(province.toLowerCase())
);

const handleSelect = (prov) => {
  setSelected(prov);
  setOpen(false);
  setprovince(prov);
};
const getProductCart = async () => {  
  if (!user?.id) return;
  try {
    const res = await axios.get(`http://192.168.1.17:2025/api/GetProductCart/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    });

    // Normalize: keep only the array of products
    const products = res.data?.cart?.products || [];
    setProductCart(products);
  } catch (error) {
    console.log(error);
  }
};
const handleOrder = async () => {
  console.log(user.id);
  
  try {
    const res = await axios.post(
      `http://192.168.1.17:2025/api/create-order/${user.id}`,
      {
        nom,
        prenom,
        email,
        telephone,
        rue,
        complement,
        ville,
        province,
        postal
      },
      {
        headers: { Authorization: `Bearer ${user.token}` }
      }
    );

    toast.success('Commande envoyée avec succès');
    navigate('/order-confirmation', { state: { order: res.data.order } });
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Erreur lors de la commande');
  }
};


const total = useMemo(() => {
  return productCart.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
}, [productCart]);

  useEffect(() => {
    getProductCart();
  }, []);

  return (
<div className="Commande">
  <Toaster/>
  <Link className="h1" to="/" style={{ textDecoration: "none", color: "black" }}>
    <h1>Finaliser votre commande</h1>
  </Link>
  <h4>Quelques étapes simples pour recevoir vos produits</h4>

  <div className="facturation">
    {/* FORMULAIRE */}
    <div className="facturation-1">
      {/* Infos destinataire */}
      <div id="Form">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="ICON">
            <ShoppingBag size={21} />
          </div>
          <h3 style={{ margin: "0", marginLeft: "1%" }}>
            Informations sur le destinataire
          </h3>
        </div>
        <div className="form">
          <div className="input-group">
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="nom" className={nom ? "active" : ""}>
              Nom
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="prenom" className={prenom ? "active" : ""}>
              Prénom
            </label>
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="email" className={email ? "active" : ""}>
              E-mail
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="telephone" className={telephone ? "active" : ""}>
              Téléphone
            </label>
          </div>
        </div>
      </div>

      {/* Adresse livraison */}
      <div id="Form" style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="ICON">
            <Truck size={21} />
          </div>
          <h3 style={{ margin: "0", marginLeft: "1%" }}>Adresse de livraison</h3>
        </div>
        <div className="form">
          <div className="input-group">
            <input
              type="text"
              id="rue"
              value={rue}
              onChange={(e) => setRue(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="rue" className={rue ? "active" : ""}>
              Numéro et nom de rue *
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="complement" className={complement ? "active" : ""}>
              Escalier, étage... (Facultatif)
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              id="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="ville" className={ville ? "active" : ""}>
              Ville
            </label>
          </div>

          {/* Dropdown provinces */}
          <div className="dropdown">
            <div className="dropdown-btn" onClick={() => setOpen(!open)}>
              {selected} <span>{open ? <ChevronUp /> : <ChevronDown />}</span>
            </div>
            {open && (
              <div className="dropdown-content">
                <input
                  type="text"
                  placeholder="Cherche ici"
                  value={province}
                  onChange={(e) => setprovince(e.target.value)}
                />
                {filteredProvinces.map((prov, i) => (
                  <div
                    key={i}
                    className="dropdown-item"
                    onClick={() => handleSelect(prov)}
                  >
                    {prov}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <input
              type="text"
              id="postal"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="postal" className={postal ? "active" : ""}>
              Code postal
            </label>
          </div>
        </div>
      </div>
      {/* Détails des produits dans le panier */}
      <div className="cart-details" style={{ marginTop: "40px" }}>
        <h3>Produits dans votre panier</h3>
        <div className="cart-list">
          {productCart.map((item, index) => (
            <div
              key={index}
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
              }}
            >
              <div style={{ flex: 1 }}>
                <p><strong>Nom :</strong> {item.productId?.name}</p>
                <p><strong>Taille :</strong> {item.size}</p>
                <p><strong>Couleur :</strong> {item.color}</p>
                <p><strong>Quantité :</strong> {item.quantity}</p>
              </div>
              <div style={{ textAlign: "right", minWidth: "100px" }}>
                <p><strong>{item.productId?.price} DT</strong></p>
              </div>
            </div>
          ))}
        </div>   
      </div>
    </div>

    
    

    {/* RÉSUMÉ ACHAT */}
    <div id='facturation-2' className="facturation-2">
      <h3>Résumé de l’achat ({productCart.length})</h3>
      <div className="Continuer">
      <h4>Total {total.toFixed(2)} DT</h4>
        <div className="btC">
          <button onClick={handleOrder} className="btContinuer">  Continuer la commande</button>
        </div>
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <footer className="footer-2">
    <div className="footer-links">
      <a href="#">Conditions générales d'achat</a>
      <span>•</span>
      <a href="#">Conditions générales de #esbeandstyle</a>
      <span>•</span>
      <a href="#">Politique de confidentialité</a>
      <span>•</span>
      <a href="#">Politique de cookies</a>
    </div>
    <div className="footer-copy">© 2025 ESBEAND CLOTHES</div>
  </footer>
</div>

  )
}

export default CommandeComp