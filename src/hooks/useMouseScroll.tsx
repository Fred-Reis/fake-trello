import React from "react";
import Coord from "../models/Coord";
import { clearInterval, setInterval } from "timers";

export default function useMouseScroll(condition: boolean) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const mouseCoordRef = React.useRef<Coord>({ x: 0, y: 0 });

  const edgeSize = 100;
  const maxStep = 20;

  const saveMouseCoord = React.useCallback((event: MouseEvent) => {
    mouseCoordRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const checkMoveScroll = React.useCallback(() => {
    const element = scrollRef.current as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const topEdge = edgeSize + rect.y;
    const bottomEdge = rect.y + rect.height - edgeSize;

    const inBottomEdge = mouseCoordRef.current.y >= bottomEdge;
    const inTopEdge = mouseCoordRef.current.y <= topEdge;

    // if (inBottomEdge) {
    //   element.style.borderBottom = "2px solid red";
    // } else if (inTopEdge) {
    //   element.style.borderTop = "2px solid red";
    // }

    const canScrollUp = element.scrollTop > 0;
    const canScrollDown =
      element.scrollTop < element.scrollHeight - rect.height;

    if ((!inBottomEdge || !canScrollDown) && (!inTopEdge || !canScrollUp)) {
      // element.style.border = "none";
      return false;
    }

    let nextScroll = element.scrollTop;

    if (canScrollDown && inBottomEdge) {
      const intensity = (mouseCoordRef.current.y - bottomEdge) / edgeSize;
      nextScroll = nextScroll + Math.min(maxStep * intensity, maxStep);
    } else if (canScrollUp && inTopEdge) {
      const intensity = (topEdge - mouseCoordRef.current.y) / edgeSize;
      nextScroll = nextScroll - Math.min(maxStep * intensity, maxStep);
    }

    if (nextScroll !== element.scrollTop) {
      element.scrollTo({
        top: nextScroll,
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    if (condition) {
      intervalRef.current = setInterval(checkMoveScroll, 30);
      window.addEventListener("mousemove", saveMouseCoord);
    } else {
      window.removeEventListener("mousemove", saveMouseCoord);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", saveMouseCoord);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [saveMouseCoord, checkMoveScroll, condition]);

  return scrollRef;
}
