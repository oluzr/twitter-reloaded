import Timeline from '../components/timeline';
import PostTweetForm from '../components/post-tweet-form';
import { styled } from 'styled-components';
const Wrapper = styled.div`
  display: grid;
  border-right: 1px solid #efefef;
  border-left: 1px solid #efefef;
  background-color: #fff;
  overflow-y: auto;
  grid-template-rows: 1fr 5fr;
  @media only screen and (max-width: 600px) {
    grid-template-rows: unset;
    padding-bottom: 40px;
  }
`
const Home = () => {

  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
};

export default Home;