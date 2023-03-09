import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [promptInputProduct, setPromptInputProduct] = useState("");
  const [promptInputRole, setPromptInputRole]= useState("");
  const [promptInputLevel, setPromptInputLevel]= useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promptProduct: promptInputProduct, promptRole : promptInputRole, promptLevel : promptInputLevel }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPromptInputProduct("");
      setPromptInputRole("");
      setPromptInputLevel("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <h3>ALM GPT POC</h3>
        <form onSubmit={onSubmit}>
          <div>Which product do you want to create the Learning Path for: </div>
          <input
            type="text"
            name="promptBoxProduct"
            placeholder="Enter your product here"
            value={promptInputProduct}
            onChange={(e) => setPromptInputProduct(e.target.value)}
          />
          <div>What role is this Learning Path intended for:  </div>
          <input
            type="text"
            name="promptBoxRole"
            placeholder="Enter role here"
            value={promptInputRole}
            onChange={(e) => setPromptInputRole(e.target.value)}
          />
          <div>What level of expertise is this Learning Path targeting?:  </div>
          <input
            type="text"
            name="promptBoxRole"
            placeholder="Enter level here"
            value={promptInputLevel}
            onChange={(e) => setPromptInputLevel(e.target.value)}
          />
          <input type="submit" value="Generate suggestions" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}