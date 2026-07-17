import { geometricCorrection } from "./transformer/layout/geometricCorrection";
import { LayoutData, ColumnSeparatorLabel, Label } from "./transformer/types";

export function geometricCorrectionSetter(
  layoutData: LayoutData,
  labelRefs: Map<string, { node: HTMLElement; label: ColumnSeparatorLabel }>
): LayoutData {
  const measuredLabels = new Map<string, Label>();

  labelRefs.forEach(({ node, label }, key) => {
    const rect = node.getBoundingClientRect();
    measuredLabels.set(key, { ...label, measuredWidth: rect.width, measuredHeight: rect.height });
  });

  return geometricCorrection(layoutData, measuredLabels);
}