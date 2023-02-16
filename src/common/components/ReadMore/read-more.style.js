import styled from "styled-components";

const ReadMoreWrapper = styled.div`
    .all-text {
        line-height: 1.9;
        font-size: 1.125rem;
        padding: 0 15px;
        opacity: 0.7;
    }

    .read-more__button:hover {
      text-decoration: underline;
    }

    .read-more__text--hide {
      max-height: 0;
      font-size: 0;
    }

    .read-more__text--show {
      max-height: 10em;
      font-size: inherit;
    }
`;

export default ReadMoreWrapper;
