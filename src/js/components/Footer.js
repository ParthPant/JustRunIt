import React from "react";
import styled from "styled-components";
import ParthLogo from "../../images/parth.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faInstagram,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  margin: 1em 0;
  color: white;
  font-family: Roboto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 50%;
  .icons{
    *{
      margin: 1em 0.5em;
    }
    a {
      color: white;
    }
  }
  .tag {
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      margin-left: 1em;
    }
  }
`;

export default function Footer() {
  return (
    <Container>
      <div className="tag">
        Made with ❤️ by
        <a href="https://ParthPant.github.io">
          <ParthLogo
            className="logo"
            fill="white"
            width="3.5em"
            height="auto"
          />
        </a>
      </div>
      <div className="icons">
        <a href="https://github.com/ParthPant">
          <FontAwesomeIcon icon={faGithub} size="2x"/>
        </a>
        <a href="https://www.linkedin.com/in/parth-pant-866bb4189/">
          <FontAwesomeIcon icon={faLinkedin} size="2x"/>
        </a>
        <a href="https://www.instagram.com/pantparth/">
          <FontAwesomeIcon icon={faInstagram} size="2x"/>
        </a>
        <a href="https://twitter.com/PantParth">
          <FontAwesomeIcon icon={faTwitter} size="2x"/>
        </a>
      </div>
    </Container>
  );
}
