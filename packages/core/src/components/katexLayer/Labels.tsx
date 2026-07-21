import { ColumnSeparatorLabel, Label } from "../../transformer/types";
import styles from "../../VariationTable.module.css";

export function Labels({ labels, labelrefs }: { labels: Label[], labelrefs: Map<string, { node: HTMLElement, label: ColumnSeparatorLabel }> }) {
  return (
    <>
      {labels.map((label, i) => {
        let className = styles.katexNode;

        if (label.hPosition === "left") {
          className += ` ${styles.katexNodeLeftAligned}`;
        } else if (label.hPosition === "right") {
          className += ` ${styles.katexNodeRightAligned}`;
        }

        if (label.vPosition === "top") {
          className += ` ${styles.katexNodeTopAligned}`;
        } else if (label.vPosition === "bottom") {
          className += ` ${styles.katexNodeBottomAligned}`;
        }



        const key = `${label.role}-${i}`;
        const maxWidth = label.maxWidth ? `${label.maxWidth}px`: 'none'
        return (
          <span
            key={key}
            ref={(node) => {
              if (label.role === 'columnSeparatorLabel') {
                if (node) {
                  labelrefs.set(key, { node, label });
                }
                else {
                  labelrefs.delete(key);
                }
              }
            }
            }
            style={{
              left: `${label.anchor.x}px`,
              top: `${label.anchor.y}px`,
              maxWidth : maxWidth,
              boxSizing : "border-box",
              padding : '1px',
            }}
            className={className}
          >
            <span className={styles.katexSubNode}>{label.value}</span>
          </span >
        );
      })}
    </>
  );
}