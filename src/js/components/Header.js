import React from "react";
import Logo from "../../images/logo.svg";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 0 1em;
`;
export default function Header(props) {
  return (
    <Container>
      <Logo height="80px" width="auto" />
    </Container>
  );
}
