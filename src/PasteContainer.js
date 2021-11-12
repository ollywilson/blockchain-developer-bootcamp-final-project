import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { availableLangs } from "./langs";

export const PasteContainer = ({ state }) => {
  const [pasteState, setPasteState] = useState({
    pastedTitle: "",
    pastedText: "",
    lang: "javascript",
    pasteEditPublic: false,
  });
  const [textInput, setTextInput] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const contract = state.contract;
    const accounts = state.accounts;
    
    if (
      accounts &&
      accounts.length &&
      state.utilizedPasteAddress &&
      state.utilizedPasteAddress.length
    ) {
      contract.methods
        .getPasteSnippet(state.utilizedPasteAddress)
        .call()
        .catch((e) => {})
        .then((cr) => {
          if (cr && cr.name !== undefined && cr.content !== undefined) {
            setPasteState((pasteState) => ({
              ...pasteState,
              pastedTitle: cr.name,
              pastedText: cr.content,
              lang: cr.lang ? cr.lang : "javascript",
              pasteEditPublic: cr.public_edit,
            }));
          }
        })
        .catch((e) => {
          setError(`Error code ${e.code}: ${e.message}`);
        });
    }
  }, [state.contract, state.accounts, state.utilizedPasteAddress]);

  const handleSubmit = () => {
    const contract = state.contract;
    const accounts = state.accounts;

    if (accounts.length) {
      setError("");
      setTxPending(true);

      if (
        state.utilizedPasteAddress.toLowerCase() !==
        state.accounts[0].toLowerCase()
      ) {
        if (accounts.length) {
          setTxPending(true);
          contract.methods
            .changePasteSnippetContent(state.utilizedPasteAddress, textInput, pasteState.lang)
            .send({ from: accounts[0] })
            .catch((e) => {
              setTxPending(false);
              setError(`Error code ${e.code}: ${e.message}`);
            })
            .then((response) => {
              contract.methods
                .getPasteSnippet(state.utilizedPasteAddress)
                .call()
                .catch((e) => {})
                .then((cr) => {
                  if (cr && cr.content !== undefined) {
                    setTxPending(false);
                    setPasteState((pasteState) => ({
                      ...pasteState,
                      pastedText: cr.content,
                    }));
                  }
                })
                .catch((e) => {
                  setError(`Error code ${e.code}: ${e.message}`);
                });
            })
            .catch((e) => {
              setTxPending(false);
              setError(`Error code ${e.code}: ${e.message}`);
            });
        }
      } else {
        contract.methods
          .addPasteSnippet("New snippet title", textInput, pasteState.lang)
          .send({ from: accounts[0] })
          .catch((e) => {
            setTxPending(false);
            setError(`Error code ${e.code}: ${e.message}`);
          })
          .then((response) => {
            contract.methods
              .getPasteSnippet(state.utilizedPasteAddress)
              .call()
              .then((cr) => {
                if (cr.name !== undefined && cr.content !== undefined) {
                  setTxPending(false);
                  setPasteState({
                    ...pasteState,
                    pastedTitle: cr.name,
                    pastedText: cr.content,
                    lang: cr.lang,
                    pasteEditPublic: cr.public_edit,
                  });
                }
              })
              .catch((e) => {
                setTxPending(false);
                setError(`Error code ${e.code}: ${e.message}`);
              });
          });
      }
    }
  };

  const handleChangeLang = (newLang) => {
    setPasteState({
      ...pasteState,
      lang: newLang,
    });
  };

  const handleChangeEdit = () => {
    const contract = state.contract;
    const accounts = state.accounts;

    if (accounts.length) {
      setTxPending(true);
      contract.methods
        .changePasteSnippetPublicEdit(
          state.utilizedPasteAddress,
          !pasteState.pasteEditPublic
        )
        .send({ from: accounts[0] })
        .then((response) => {
          setTxPending(false);
          contract.methods
            .getPasteSnippet(state.utilizedPasteAddress)
            .call()
            .then((cvr) => {
              if (cvr) {
                setPasteState({
                  ...pasteState,
                  pasteEditPublic: cvr.public_edit,
                });
              }
            });
        })
        .catch((e) => {
          setTxPending(false);
          console.log(e);
        });
    }
  };

  const isOwner =
    state.utilizedPasteAddress.toLowerCase() ===
    state.accounts[0].toLowerCase();

  const canEdit =
    state.accounts &&
    state.accounts.length &&
    (pasteState.pasteEditPublic || isOwner);

  return (
    <>
      <h1 className={"fw-bold mb-3"}>{"Welcome to Web 3.0 code paster!"}</h1>
      <h5 className={"text-muted"}>
        {"Paste code snippets in the left pane below, and then click submit."}
      </h5>
      <h5 className={"text-muted"}>
        {
          "You can make your code snippets publicly editable by clicking the grey button below."
        }
      </h5>
      <h5 className={"text-muted mb-3"}>
        {`Snippets can be accessed at ${window.location.origin}/{wallet_address}.`}
      </h5>
      {state.accounts && state.accounts.length ? (
        <h5>{`Your address: ${state.accounts[0]}`}</h5>
      ) : (
        <div />
      )}
      <h5>{`This Snippet's address: ${state.utilizedPasteAddress}`}</h5>

      <Form.Group className={"main-container mt-5"}>
        {state.accounts && state.accounts.length ? (
          <Row>
            <Col sm={{ span: 2, offset: 0 }}>
              <Button
                disabled={!canEdit || txPending}
                className={"small-font"}
                variant={"success"}
                onClick={() => handleSubmit()}
              >
                {"Submit text area"}
              </Button>
            </Col>
            <Col sm={{ span: 2, offset: 0 }}>
              <Form.Select
                disabled={!canEdit || txPending}
                value={pasteState.lang ? pasteState.lang : "javascript"}
                className={"small-font"}
                onChange={(e) => handleChangeLang(e.target.value)}
              >
                {availableLangs.map((l, idx) => {
                  return (
                    <option value={l} key={`lang-${l}-${idx}`}>
                      {l}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col sm={{ span: 2, offset: 0 }}>
              <Button
                disabled={!isOwner || txPending}
                className={"small-font"}
                variant={"light"}
                onClick={() => handleChangeEdit()}
              >{`Publicly editable: ${pasteState.pasteEditPublic}`}</Button>
            </Col>

            <Col sm={{ span: 2, offset: 2 }}>
              <Button
                className={"small-font"}
                variant={"primary"}
                onClick={() => {
                  const copyText = `${window.location.origin}/${state.utilizedPasteAddress}`;

                  navigator.clipboard.writeText(copyText);
                }}
              >{`Copy link to this snippet`}</Button>
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Form.Group>

      {txPending ? (
        <Form.Group className={"main-container mt-5"}>
          <>
            <Spinner size={"sm"} animation="border" role="status"></Spinner>{" "}
            <span>{"Transaction pending..."}</span>
          </>
        </Form.Group>
      ) : (
        <></>
      )}

      {error.length ? (
        <Form.Group className={"main-container mt-5"}>
          <div className={"text-danger small-font"}>{error}</div>
        </Form.Group>
      ) : (
        <></>
      )}

      <Form.Group className={"main-container mt-5"}>
        <Row>
          <Col sm={6}>
            <Form.Control
              as="textarea"
              placeholder="Enter paste here"
              style={{ height: "300px", fontSize: 10 }}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </Col>
          <Col sm={6}>
            {pasteState.pastedText.length ? (
              <div style={{ textAlign: "left", fontSize: 10 }}>
                <SyntaxHighlighter
                  language={pasteState.lang ? pasteState.lang : "javascript"}
                  style={dark}
                  showLineNumbers={true}
                >
                  {pasteState.pastedText}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div />
            )}
          </Col>
        </Row>
      </Form.Group>
    </>
  );
};
