import { useEffect, useState } from "react";
import ReadMoreWrapper from "./read-more.style";
import { decode } from "html-entities";

const ELLIPSES = "…";
const SHOW_LESS_TEXT = "Show Less";
const SHOW_MORE_TEXT = "Read More";

function ReadMore({
  text,
  numberOfLines = 2,
  lineHeight = 1.9,
  readMoreCharacterLimit = 105,
  showLessButton = false,
  button = null,
}) {
  const [showingAll, setShowingAll] = useState(false);
  const [hasRemainingText, setHasRemainingText] = useState(false);
  const [txt, setTxt] = useState(null);
  const [btn, setBtn] = useState(null);

  useEffect(() => {
    const maxHeight = numberOfLines * lineHeight;
    const style = {
      lineHeight,
      maxHeight: `${maxHeight}em`,
    };

    const toggleReadMore = () => {
      setShowingAll(!showingAll);
    };
    const getActionButton = () => {
      if (showingAll && !showLessButton) {
        return <></>;
      }

      const buttonText = showingAll ? SHOW_LESS_TEXT : SHOW_MORE_TEXT;

      return (
        // eslint-disable-next-line react/button-has-type
        <button onClick={toggleReadMore} className="read-more__button">
          {buttonText}
        </button>
      );
    };
    const getReadMoreParts = () => {
      let teaserText;
      let remainingText;
      const remainingWordsArray = [];

      // if (text) {
      //   const teaserWordsArray = text.split(" ");

      //   while (teaserWordsArray.join(" ").length > readMoreCharacterLimit) {
      //     remainingWordsArray.unshift(teaserWordsArray.pop());
      //   }

      //   teaserText = teaserWordsArray.join(" ");


      //   console.log(teaserText.length, teaserWordsArray.length, 'teaserText')

      //   if (remainingWordsArray.length > 0) {
      //     remainingText = remainingWordsArray.join(" ");
      //   }
      // }

      return {
        teaserText: text.slice(0, readMoreCharacterLimit),
        remainingText: "",
      };
    };
    const getText = () => {
      const { teaserText, remainingText } = getReadMoreParts();
      setHasRemainingText(!!remainingText);

      if (!showingAll && text.length > readMoreCharacterLimit) {
        return (
          <span className="all-text">
            <span dangerouslySetInnerHTML={{ __html: decode(teaserText.replace(/\s*$/, ""))}}></span>
            <span
              style={{
                maxHeight: 0,
                fontSize: 0,
              }}
              className="read-more__text--remaining read-more__text--hide"
            >
              {remainingText}
            </span>
            {ELLIPSES}
            {button || btn}
          </span>
        );
      }

      return (
        <ReadMoreWrapper>
          {teaserText}
          {button || btn}
          {/* <Collapse
            style={style}
            component="span"
            in={showingAll}
            timeout="auto"
            unmountOnExit
          >
            {remainingText}
          </Collapse> */}
        </ReadMoreWrapper>
      );
    };
    setTxt(getText());
    setBtn(getActionButton());
  }, [
    readMoreCharacterLimit,
    showLessButton,
    showingAll,
    text,
    lineHeight,
    numberOfLines,
  ]);

  return <>{txt}</>;
}

export default ReadMore;
