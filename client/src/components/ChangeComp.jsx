import React,{useState,useEffect} from 'react'
import back1 from '../images/es.png'
import back2 from '../images/bachome.jpg'
import back3 from '../images/bachome2.jpg'

const backgrounds = [back1,back2,back3];

const ChangeComp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const[Ring,setRing]=useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
    return (
    <div className='ChangeComp' style={{backgroundImage: `url('${backgrounds[currentIndex]}')`,}}>
      <div className='HeaderBar-2'>
        <h3 style={{ color: "white", textAlign: "center", padding: "6px", margin: 0 }}>
          Livraison gratuite à partir de 120 DT
        </h3>
      </div>
    </div>
    )
}

export default ChangeComp