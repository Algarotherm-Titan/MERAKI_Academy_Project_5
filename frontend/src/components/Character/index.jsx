import React, { useEffect, useState, useRef } from "react";
import NavBar from "../Navbar";
import "./style.css";
const Character = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const areas = [
    {
      id: 1,
      title: "Ionia",
      champ: [
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181996/Screenshot_6_f3oigb.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181996/Screenshot_7_qsujhx.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181996/Screenshot_9_srv1vg.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181997/Screenshot_10_kee2km.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181997/Screenshot_11_khvbjb.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181997/Screenshot_13_i7dlmn.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181997/Screenshot_12_gonyv7.png",
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697181998/Screenshot_16_ncvwlz.png",
      ],
    },
    {
      id: 2,
      title: "DEMACIA",
      champ: [],
    },
    {
      id: 3,
      title: "NOXUS",
      champ: [],
    },
    {
      id: 4,
      title: "PILTOVER & ZAUN",
      champ: [],
    },
    {
      id: 5,
      title: "BILGEWATER",
      champ: [],
    },
    {
      id: 6,
      title: "SHADOW ISLES",
      champ: [],
    },
  ];

  const handleCharacterClick = (area) => {
    setSelectedCharacter(area);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % selectedCharacter.champ.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedCharacter.champ.length) %
        selectedCharacter.champ.length
    );
  };

  // useEffect(() => {
  //   const interval = setInterval(nextImage, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div className="chBody">
       <NavBar />
      <div>
        <video className="main" autoPlay loop muted playsInline>
          <source
            src="https://res.cloudinary.com/dmhvb05w3/video/upload/v1697093646/xiao-lanterns-on-the-full-moon-night-genshin-impact-moewalls-com_tnjokd.mp4"
            type="video/mp4"
          />
        </video>
        <div className="character__sidebar">
          {areas.map((area) => (
            <div
              className="area"
              key={area.id}
              onClick={() => handleCharacterClick(area)}
            >
              <p>{area.title}</p>
            </div>
          ))}
        </div>
        {selectedCharacter && (
          <div className="image-slider2">
            <img
              src={selectedCharacter?.champ[currentImageIndex]}
              alt={`Image ${currentImageIndex}`}
            />
            <button onClick={prevImage} style={{ cursor: "pointer" }}>
              Previous
            </button>
            <button onClick={nextImage}>Next</button>
          </div>
        )}
        {selectedCharacter && (
          <div className="-area">
            <h2>{selectedCharacter.title}</h2>
            <div className="images2">
              {selectedCharacter?.champ?.map((subImage, index) => (
                <img
                  key={index}
                  src={subImage}
                  alt={`Sub Image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Character;
