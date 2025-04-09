import { cn } from "@/lib/utils";
import { useEffect, useState, forwardRef } from "react";
import { createPortal } from "react-dom";

const styles = new Map<string, string>();

export const IFrame = forwardRef<HTMLIFrameElement, { children: React.ReactNode, id?: string, className?: string, onClick?: () => void }>(
  ({ children, id, className, onClick }, ref) => {
    const [internalRef, setInternalRef] = useState<HTMLIFrameElement | null>(null);
    const container = internalRef?.contentDocument?.body;

    useEffect(() => {
      if (!internalRef?.contentDocument) return;

      document.head.querySelectorAll("[rel='stylesheet']").forEach((style) => {
        const frameStyles = style.cloneNode(true);
        const href = (style as HTMLLinkElement).href;

        if (!styles.has(href)) {
          styles.set(href, href);
          internalRef.contentDocument?.head.append(frameStyles);
        }
      });

    }, [internalRef, children]);

    const setRefs = (node: HTMLIFrameElement | null) => {
      setInternalRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useEffect(() => {
      if (!internalRef?.contentDocument?.body) return;

      const resizeObserver = new ResizeObserver(() => {
        const height = internalRef.contentDocument?.body.scrollHeight;
        internalRef.style.height = `${height}px`;
      });

      resizeObserver.observe(internalRef.contentDocument.body);

      return () => {
        resizeObserver.disconnect();
      };
    }, [internalRef]);

    useEffect(() => {
      if (!internalRef?.contentDocument?.body) return;
      
      const handleClick = () => {
        onClick?.();
      };

      internalRef.contentDocument.body.addEventListener('click', handleClick);

      return () => {
        internalRef.contentDocument?.body?.removeEventListener('click', handleClick);
      };
    }, [internalRef, onClick]);

    return (
      <iframe 
        title="iframe" 
        ref={setRefs} 
        className={cn("w-full h-full border-0", className)}
        id={id}
      >
        {container && createPortal(children, container)}
      </iframe>
    );
  }
);

IFrame.displayName = 'IFrame';
