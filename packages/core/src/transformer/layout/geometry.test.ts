import { Segment } from "../types";
import { getSegmentIntersection } from "./geometry";

export function testGeometry() {
    let seg1: Segment = {
        start: { x: 131, y: 193.33 },
        end: { x: 245.88, y: 193.33}
    };
    let seg2: Segment = {
        start: { x: 469.94, y: 246.83 },
        end: { x: 188.44, y: 183.17 }
    };
    let intersection = getSegmentIntersection(seg1, seg2);
    console.log(
`
mustExists : ${intersection && "Yes"} \n
value : x : ${intersection?.x}\n
        y : ${intersection?.y}
`
    );
}