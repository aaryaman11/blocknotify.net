import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DApp from './DApp';
import Register from './Register';
// import ComingSoon from './ComingSoon';
import { Alert, Container, Nav, Navbar } from 'react-bootstrap';
// import Images from './Images';
import { ChainProvider } from './ChainContext';
import { StatusProvider } from './StatusContext';
import Verify from "./Verify";
// import { ContractProvider } from './ContractContext';

function Unknown() {
    return (
        <>
            <Alert variant="danger">
                <Alert.Heading>404 Not Found</Alert.Heading>
                <span>
                    The URL you are trying to access does not exist or an error
                    has occurred.
                </span>
                <hr />
                <pre>
                    You can head back to our <a href="/">homepage</a>.
                </pre>
            </Alert>
        </>
    );
}

function App() {
    return (
        <StatusProvider>
            <ChainProvider>
                {/*<ContractProvider>*/}
                    <Router>
                        <Navbar bg="dark" expand="lg" variant="dark">
                            <Container>
                                <Navbar.Brand href="/" className="">
                                    <span className="text-light">Block</span>
                                    <span className="text-primary">
                                        Notify
                                    </span>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <Nav.Link
                                            href="/dapp"
                                            className="text-light"
                                        >
                                            DApp
                                        </Nav.Link>
                                        <Nav.Link
                                            href="/register"
                                            className="text-light"
                                        >
                                            Register
                                        </Nav.Link>
                                        <Nav.Link
                                            href="/verify"
                                            className="text-light"
                                        >
                                            Verify
                                        </Nav.Link>
                                    </Nav>
                                    <Nav>
                                        <Nav.Link
                                            href="https://discord.gg/jsBsDbF8Ke"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Support
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <Routes>
                            <Route exact path="/" element={<Register />} />
                            <Route exact path="/dapp" element={<DApp />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/*" element={<Unknown />} />
                        </Routes>
                    </Router>
                {/*</ContractProvider>*/}
            </ChainProvider>
        </StatusProvider>
    );
}

export default App;