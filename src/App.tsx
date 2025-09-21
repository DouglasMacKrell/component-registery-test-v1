import { demoPage } from "./mockPage";
import { renderBlocks } from "./renderBlocks";

export default function App() {
  return (
    <main>
      {demoPage.pageTitle && <title>{demoPage.pageTitle}</title>}
      {renderBlocks(demoPage.blocks)}
    </main>
  );
}