import React, { useState } from "react";
import Footer from "../Navbar/footer";
import { useNavigate } from "react-router-dom";

import "./syle.css";

const FrontPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = React.createRef();
  const navigate = useNavigate();

  const characters = [
    {
      id: 1,
      title: "zed",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263726/Screenshot_31_kdq5dx.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265364/zed_tyc34r.mp3",
    },
    {
      id: 2,
      title: "aatrox",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263726/Screenshot_30_kvgcrn.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265365/aatrox_txgwwn.mp3",
    },
    {
      id: 3,
      title: "syslas",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263726/Screenshot_5_kp0p3f.png",
      audio: "",
    },
    {
      id: 4,
      title: "Jhin",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263726/Screenshot_29_j6adif.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697231434/2023-10-14_00-08-21_uzvi4i.mp3",
    },
    {
      id: 4,
      title: "veigo",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263726/Screenshot_28_etsele.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265364/vigo_pk8any.mp3",
    },
    {
      id: 4,
      title: "sett",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263725/Screenshot_4_jwsnnz.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265364/sett_mpd1ky.mp3",
    },
    {
      id: 4,
      title: "akaliy",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263725/Screenshot_3_pt4jpp.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265364/akaliy_spgawa.mp3",
    },
    {
      id: 4,
      title: "heca",
      image:
        "https://res.cloudinary.com/dmhvb05w3/image/upload/v1697263725/Screenshot_2_zqa3ga.png",
      audio:
        "https://res.cloudinary.com/dmhvb05w3/video/upload/v1697265364/hecca_gs55ki.mp3",
    },
  ];

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };
  const navigateToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="background-container">
      <div className="background-image">
        <div className="background-video"></div>

        <div className="btn-page" onClick={navigateToLoginPage}>
          OFFICIAL WEBSITE
        </div>
        <div className="languageSelect">
          <h1 className="languageSelec">en</h1>
        </div>
        <img
          src="https://res.cloudinary.com/dmhvb05w3/image/upload/v1697139315/download-removebg-preview_amtoid.png"
          className="logo"
          alt="Logo"
        />

        <div class="p1-btns">
          <a
            class="PC"
            href="javascript:void(0)"
            onclick="gtag('event', 'homepage PC download', { 'event_category': 'click', 'event_label': 'Branding'})"
          >
            <img
              src="https://webstatic.hoyoverse.com/upload/event/2023/06/16/f5675485246f78738f52cd9ba9d8bb80_5196703687952392730.png"
              alt="PC"
            />
          </a>
          <a
            class="steam"
            href="javascript:void(0)"
            onclick="gtag('event', 'homepage steam', { 'event_category': 'click', 'event_label': 'Branding'})"
          >
            <img
              src="https://webstatic.hoyoverse.com/upload/event/2023/04/19/5dbe040157bb6434b0b18b8292282b32_3632237727328970001.png"
              alt="Steam"
            />
          </a>
          <a
            class="epic"
            href="javascript:void(0)"
            onclick="gtag('event', 'homepage epic', { 'event_category': 'click', 'event_label': 'Branding'})"
          >
            <img
              src="https://webstatic.hoyoverse.com/upload/event/2023/06/16/2577fdf3178c59e64861b4d41c8def13_1289788108854828378.png"
              alt="Epic"
            />
          </a>
          <a
            class="apple"
            href="javascript:void(0)"
            onclick="gtag('event', 'homepage Appstore', { 'event_category': 'click', 'event_label': 'Branding'})"
          >
            <img
              src="https://webstatic.hoyoverse.com/upload/event/2023/06/16/dfd1d5393a451babbcf946ca340ca454_1048735058485620098.png"
              alt="Apple"
            />
          </a>
          <a
            class="google"
            href="javascript:void(0)"
            onclick="gtag('event', 'homepage googleplay', { 'event_category': 'click', 'event_label': 'Branding'})"
          >
            <img
              src="https://webstatic.hoyoverse.com/upload/event/2023/04/19/b844aa37a8f56c86dcb73ac608ef87bc_7486702195076102975.png"
              alt="Google"
            />
          </a>
        </div>
      </div>
      <div className="background-">
        <div className="background-2">
          <div class="championsHeader_T0ou">
            <div class="visible_">
              <img
                class="icon_23Iu"
                src="https://universe.leagueoflegends.com/esimages/content_type_icon_champion__3nwJQ.png"
                alt="champion Icon"
              />
              <h1
                class="title_SNe9"
                data-gettext-identifier="champbrowse-title"
              >
                Champions
              </h1>
              <div className="charcter">
                {characters.map((character) => (
                  <div className="character-item" key={character.id}>
                    <a onClick={() => handleCharacterClick(character)}>
                      <img src={character.image} alt={character.title} />
                    </a>
                  </div>
                ))}
              </div>
              {selectedCharacter && (
                <div
                  className="selected-character"
                  style={{
                    margin: 0,
                    backgroundImage:
                      "url(data:image/png;base64,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UmVhZHlxyWU8AAADIWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQkExN0M3RUFEMjcxMUU5OUUyQUM5M0UyNkVGMjdCNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEQkExN0M3REFEMjcxMUU5OUUyQUM5M0UyNkVGMjdCNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkZBMDhFRDZBQzVGMTFFOTlBNjRBNEExMzUzMzc5RjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkZBMDhFRDdBQzVGMTFFOTlBNjRBNEExMzUzMzc5RjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5l7Jh5AAAIMklEQVR42uxda2wUVRQ+c2d2+263lEJbHqVIaHlrpUUkPsJLRQ2YaFSMUSPRf/4gwZiYaKI//CWJxlf0h79QAviMEiFULA2CRUBE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",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {audioPlaying ? (
                    <button onClick={pauseAudio}></button>
                  ) : (
                    <button onClick={playAudio}></button>
                  )}
                  <audio ref={audioRef}>
                    <source src={selectedCharacter.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FrontPage;
