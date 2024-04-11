import React, { ReactNode, FC } from 'react';

// Define the types for the props
interface BoundaryTextProps {
  boundary: string;
  children: string;
}

interface RenderTextWithBoundariesProps {
  text: string;
  boundaries?: string[];
  DefaultText?: FC<{ children: string }>;
  BoundaryText?: FC<BoundaryTextProps>;
}

const RenderTextWithBoundaries: FC<RenderTextWithBoundariesProps> = ({
  text,
  boundaries = ['"', "'"],
  DefaultText = ({ children }) => <span>{children}</span>,
  BoundaryText = DefaultBoundaryText,
}) => {
  // Function to check if the character is a boundary
  const isBoundaryChar = (char: string) => boundaries.includes(char);

  // Function to process and render text segments
  const renderSegments = (): ReactNode[] => {
    const result: ReactNode[] = [];
    let currentSegment = '';
    let insideBoundary = false;
    let currentBoundaryChar = '';

    for (const char of text) {
      if (isBoundaryChar(char)) {
        if (insideBoundary && char === currentBoundaryChar) {
          // End of boundary segment
          result.push(
            <BoundaryText key={result.length} boundary={char}>
              {currentSegment}
            </BoundaryText>,
          );
          currentSegment = '';
          insideBoundary = false;
        } else if (!insideBoundary) {
          // Start of boundary segment
          if (currentSegment) {
            // Push any existing non-boundary segment
            result.push(<DefaultText key={result.length}>{currentSegment}</DefaultText>);
            currentSegment = '';
          }
          insideBoundary = true;
          currentBoundaryChar = char;
        }
      } else {
        currentSegment += char;
      }
    }

    // Push the last segment if it exists
    if (currentSegment) {
      const Component = insideBoundary ? BoundaryText : DefaultText;
      result.push(
        <Component key={result.length} boundary={currentBoundaryChar}>
          {currentSegment}
        </Component>,
      );
    }

    return result;
  };

  return <>{renderSegments()}</>;
};

function DefaultBoundaryText(props: BoundaryTextProps) {
  switch (props.boundary) {
    case '"':
    case "'":
      return (
        <span className="italic text-green-500">
          {props.boundary}
          {props.children}
          {props.boundary}
        </span>
      );
    default:
      return (
        <span className="italic text-red-500">
          {props.boundary}
          {props.children}
          {props.boundary}
        </span>
      );
  }
}

export default RenderTextWithBoundaries;
