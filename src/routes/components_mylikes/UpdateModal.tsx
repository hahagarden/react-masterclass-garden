import { ISong, songsAtom, updateModalOnAtom } from "./atoms_mylikes";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { useForm } from "react-hook-form";

interface IUpdateModalProps {
  song: ISong;
}

const ModalWindow = styled.div<{ updateOn: boolean }>`
  display: ${(props) => (props.updateOn ? "flex" : "none")};
  background-color: white;
  border: 3px solid navy;
  width: 500px;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Header = styled.div`
  display: flex;
  margin: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

interface IForm {
  title: string;
  singer: string;
  genre: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputLine = styled.div`
  margin-top: 10px;
  width: 400px;
`;

const Label = styled.label`
  display: inline-block;
  width: 90px;
  text-align: right;
  color: black;
  padding-right: 10px;
  font-size: 20px;
`;

const Input = styled.input`
  height: 30px;
  border: none;
  border-bottom: 1px solid gray;
  outline: none;
  background-color: inherit;
  color: black;
  font-size: 20px;
  transition: border-bottom 0.3s;
  &:focus {
    border-bottom: 1px solid black;
    }
  }
`;

const GenreInputLine = styled.div`
  margin-top: 15px;
  width: 400px;
`;

const GenreInput = styled.input`
  border: none;
  border-bottom: 1px solid gray;
  outline: none;
  background-color: inherit;
  color: black;
  font-size: 20px;
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid black;
  width: 350px;
  height: 30px;
  color: black;
  font-size: 20px;
  margin: 25px;
  cursor: pointer;
  transition: background-color, color 0.3s;
  &:hover {
    background-color: navy;
    color: white;
  }
`;

function UpdateModal({ song }: IUpdateModalProps) {
  const [songs, setSongs] = useRecoilState(songsAtom);
  const [updateOn, setUpdateOn] = useRecoilState(updateModalOnAtom);
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      title: song.title,
      singer: song.singer,
      genre: song.genre,
    },
  });
  const onSubmit = (data: IForm) => {
    if (
      song.title == data.title &&
      song.singer == data.singer &&
      song.genre == data.genre
    ) {
      alert("there is no change.");
      return;
    } else if (window.confirm("are you sure updating data?")) {
      const targetIndex = songs.findIndex((obj) => obj.id == song.id);
      setSongs((prevSongs) => {
        const copySongs = [...prevSongs];
        const newSong = {
          id: song.id,
          rank: Number(song.rank),
          title: data.title,
          singer: data.singer,
          genre: data.genre,
        };
        copySongs.splice(targetIndex, 1, newSong);
        copySongs.sort((a, b) => Number(a.rank) - Number(b.rank));
        return copySongs;
      });
      console.log(data);
    }
  };
  const modalClose = () => {
    setUpdateOn((current) => {
      const copyCurrent = [...current];
      const currentIndex = copyCurrent.indexOf(true);
      copyCurrent.splice(currentIndex, 1, false);
      return copyCurrent;
    });
  };
  return (
    <ModalWindow updateOn={updateOn[Number(song.rank) - 1]}>
      <Header>
        <Title>Update</Title>
        <CloseButton onClick={modalClose}>X</CloseButton>
      </Header>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputLine>
            <Label htmlFor="title">title</Label>
            <Input
              id="title"
              autoComplete="off"
              {...register("title", { required: true })}
            ></Input>
          </InputLine>
          <InputLine>
            <Label htmlFor="singer">singer</Label>
            <Input
              id="singer"
              autoComplete="off"
              {...register("singer", { required: true })}
            ></Input>
          </InputLine>
          <GenreInputLine>
            <Label>genre</Label>
            <Label id="JPOP">
              <GenreInput
                type="radio"
                id="JPOP"
                value="JPOP"
                {...register("genre", { required: true })}
              />
              JPOP
            </Label>
            <Label id="KPOP">
              <GenreInput
                type="radio"
                id="KPOP"
                value="KPOP"
                {...register("genre", { required: true })}
              />
              KPOP
            </Label>
          </GenreInputLine>

          <Button>Update</Button>
        </Form>
      </Container>
    </ModalWindow>
  );
}

export default UpdateModal;