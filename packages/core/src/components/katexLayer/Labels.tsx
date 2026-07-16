import { Label } from "../../transformer/types";
import styles from "../../VariationTable.module.css";

export function Labels({ labels }: { labels: Label[] }) {
  return (
    <>
      {labels.map((label,i) => {
        let className = styles.katexNode;
        if (label.hPosition === "left") {
          className = `${styles.katexNode} ${styles.katexNodeLeftAligned}`;
        } else if (label.hPosition === "right") {
          className = `${styles.katexNode} ${styles.katexNodeRightAligned}`;
        }

        return (
          <span
            key={`${label.role}$-${i}`}
            style={{
              left: `${label.anchor.x}px`,
              top: `${label.anchor.y}px`,
            }}
            className={className}
          >
            <span className={styles.katexSubNode}>{label.value}</span>
          </span>
        );
      })}
    </>
  );
}