/**
 * Render blocks
 */

import type { Block } from "./types";
import { getComponentAndProps } from "./registry";

export function renderBlocks(blocks: Block[]) {
  return blocks.map((block, idx) => {
    const { Comp, props } = getComponentAndProps(block);
    if (!Comp) {
      return (
        <div key={`unknown-${idx}`} role="note">
          Unknown block: {block.type}
        </div>
      );
    }
    return <Comp key={`${block.type}-${idx}`} {...props} />;
  });
}