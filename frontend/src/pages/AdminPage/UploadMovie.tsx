import React, { useState } from 'react';
import { useDropzone, DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import './css/UploadMovie.css';
import { useNavigate } from 'react-router-dom';

const defaultGenres = [
  '드라마', '로맨스', '코미디', '스릴러', '미스터리', '호러', '액션', 'SF', '판타지', '다큐멘터리',
  '어드벤처', '우화', '다문화', '가족', '음악', '해적', '심리적', '비극적', '극복', '서스펜스',
  '정서적', '사랑', '운명', '실화', '철학적', '형이상학적', '패러디', '반전', '서정적', '상상력',
  '유머', '혼란', '노스탤지어', '실험적', '미니멀리즘', '예술적', '하이테크', '가상 현실', '미래적',
  '고전', '전쟁', '역사적', '대체 역사', '미래', '도시', '자연', '실험실', '우주', '도시 전쟁',
  '기술', '사회적', '심리전', '성장', '관계', '극단적', '아동'
];

const UploadMovie: React.FC = () => {
  const navi = useNavigate();

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [genreTags, setGenreTags] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [filteredGenres, setFilteredGenres] = useState<string[]>(defaultGenres);

  const [title, setTitle] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [actors, setActors] = useState<string>('');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [rating, setRating] = useState<number | null>(null); // 변경된 부분

  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [displayDirector, setDisplayDirector] = useState<string>('');
  const [displayActors, setDisplayActors] = useState<string>('');
  const [displayReleaseYear, setDisplayReleaseYear] = useState<string>('');
  const [displayRating, setDisplayRating] = useState<string>('');

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(true);
  const [isEditingDirector, setIsEditingDirector] = useState<boolean>(true);
  const [isEditingActors, setIsEditingActors] = useState<boolean>(true);
  const [isEditingReleaseYear, setIsEditingReleaseYear] = useState<boolean>(true);
  const [isEditingRating, setIsEditingRating] = useState<boolean>(true);

  const onDropMedia = (acceptedFiles: File[]) => {
    setMediaFile(acceptedFiles[0]);
  };

  const onDropThumbnail = (acceptedFiles: File[]) => {
    setThumbnailFile(acceptedFiles[0]);
  };

  const { getRootProps: getRootPropsMedia, getInputProps: getInputPropsMedia } = useDropzone({ onDrop: onDropMedia });
  const { getRootProps: getRootPropsThumbnail, getInputProps: getInputPropsThumbnail } = useDropzone({ onDrop: onDropThumbnail });

  const handleGenreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setNewGenre(input);
    setFilteredGenres(defaultGenres.filter(genre => genre.includes(input)));
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenres(prev => {
      const newSelectedGenres = new Set(prev);
      if (newSelectedGenres.has(genre)) {
        newSelectedGenres.delete(genre);
        setGenreTags(prevTags => prevTags.filter(tag => tag !== genre));
      } else {
        newSelectedGenres.add(genre);
        if (!genreTags.includes(genre)) {
          setGenreTags(prevTags => [...prevTags, genre]);
        }
      }
      return newSelectedGenres;
    });
    setNewGenre('');
    setFilteredGenres(defaultGenres);
  };

  const handleAddTitle = () => {
    if (title.trim()) {
      setDisplayTitle(title.trim());
      setIsEditingTitle(false);
      setTitle('');
    } else {
      setIsEditingTitle(true);
    }
  };

  const handleAddDirector = () => {
    if (director.trim()) {
      setDisplayDirector(director.trim());
      setIsEditingDirector(false);
      setDirector('');
    } else {
      setIsEditingDirector(true);
    }
  };

  const handleAddActors = () => {
    if (actors.trim()) {
      setDisplayActors(actors.trim());
      setIsEditingActors(false);
      setActors('');
    } else {
      setIsEditingActors(true);
    }
  };

  const handleAddReleaseYear = () => {
    if (releaseYear.trim()) {
      setDisplayReleaseYear(releaseYear.trim());
      setIsEditingReleaseYear(false);
      setReleaseYear('');
    } else {
      setIsEditingReleaseYear(true);
    }
  };

  const handleAddRating = () => {
    if (rating !== null && !isNaN(rating)) { // 숫자 확인
      setDisplayRating(rating.toString());
      setIsEditingRating(false);
      // rating 상태를 업데이트하지 않고, 이미 입력된 값을 유지하는 방식으로 변경
    } else {
      setIsEditingRating(true);
    }
  };


  const handleRemoveTitle = () => {
    setDisplayTitle('');
    setIsEditingTitle(true);
  };

  const handleRemoveDirector = () => {
    setDisplayDirector('');
    setIsEditingDirector(true);
  };

  const handleRemoveActors = () => {
    setDisplayActors('');
    setIsEditingActors(true);
  };

  const handleRemoveReleaseYear = () => {
    setDisplayReleaseYear('');
    setIsEditingReleaseYear(true);
  };

  const handleRemoveRating = () => {
    setDisplayRating('');
    setIsEditingRating(true);
  };

  const movieList = () => {
    navi('/dashboard/movieManage');
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (mediaFile) formData.append('file', mediaFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    formData.append('title', displayTitle);
    formData.append('director', displayDirector);
    formData.append('cast', displayActors);
    formData.append('releaseYear', displayReleaseYear);
    formData.append('synopsis', '');

    formData.append('rating', displayRating);

    formData.append('tags', Array.from(selectedGenres).join(',')); // Comma-separated string
    try {
      const response = await fetch('http://localhost:8088/api/movies/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      alert(`${result.title}의 등록에 성공했습니다.`);
      navi('/dashboard/movieManage');
    } catch (error) {
      console.error('Error:', error);
      alert('등록중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <div className="add-media">
        <h3>미디어 추가</h3>
        <div className="dropzone" {...(getRootPropsMedia() as DropzoneRootProps)}>
          <input {...(getInputPropsMedia() as DropzoneInputProps)} />
          <p>파일 업로드</p>
        </div>
        <div className="input-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 입력"
          />
          {isEditingTitle ? (
            <button onClick={handleAddTitle}>추가</button>
          ) : (
            <button onClick={handleRemoveTitle}>삭제</button>
          )}
        </div>
        <div className="input-group">
          <label>감독</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            placeholder="감독 입력"
          />
          {isEditingDirector ? (
            <button onClick={handleAddDirector}>추가</button>
          ) : (
            <button onClick={handleRemoveDirector}>삭제</button>
          )}
        </div>
        <div className="input-group">
          <label>배우</label>
          <input
            type="text"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
            placeholder="배우 입력"
          />
          {isEditingActors ? (
            <button onClick={handleAddActors}>추가</button>
          ) : (
            <button onClick={handleRemoveActors}>삭제</button>
          )}
        </div>
        <div className="input-group">
          <label>개봉 연도</label>
          <input
            type="text"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="개봉 연도 입력"
          />
          {isEditingReleaseYear ? (
            <button onClick={handleAddReleaseYear}>추가</button>
          ) : (
            <button onClick={handleRemoveReleaseYear}>삭제</button>
          )}
        </div>
        <div className="input-group">
          <label>별점</label>
          <input
            type="number"
            value={displayRating !== null ? displayRating : ''}
            onChange={(e) => setDisplayRating(e.target.value)}
            placeholder="별점 입력"
            max={10}
          />
          {isEditingRating ? (
            <button onClick={handleAddRating}>추가</button>
          ) : (
            <button onClick={handleRemoveRating}>삭제</button>
          )}
        </div>
        <div className="input-group">
          <label>장르</label>
          <div className="genre-input-container">
            <input
              type="text"
              value={newGenre}
              onChange={handleGenreInputChange}
              placeholder="장르 입력"
              className="genre-input"
            />
            <button
              onClick={() => {
                if (newGenre) {
                  handleSelectGenre(newGenre);
                }
              }}
              className="genre-add-button"
            >
              추가
            </button>
            {newGenre && (
              <div className="genre-dropdown">
                {filteredGenres.map(genre => (
                  <div key={genre} className="genre-option" onClick={() => handleSelectGenre(genre)}>
                    {genre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="media-preview">
        {mediaFile && <video src={URL.createObjectURL(mediaFile)} controls className="preview-video" />}
        {genreTags.length > 0 && (
          <div className="genre-tags-container">
            {genreTags.map(genre => (
              <div key={genre} className="genre-tag">
                <input
                  type="checkbox"
                  checked={selectedGenres.has(genre)}
                  onChange={() => handleSelectGenre(genre)}
                />
                {genre}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="add-thumbnail">
        <h3>썸네일 추가</h3>
        <div className="dropzone" {...(getRootPropsThumbnail() as DropzoneRootProps)}>
          <input {...(getInputPropsThumbnail() as DropzoneInputProps)} />
          <p>파일 업로드</p>
          <div className="preview-container">
            {thumbnailFile && <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail preview" className="preview" />}
          </div>
        </div>
        <div className="preview-details">
          <p>제목: {displayTitle}</p>
          <p>감독: {displayDirector}</p>
          <p>배우: {displayActors}</p>
          <p>개봉 연도: {displayReleaseYear}</p>
          <p>별점: {parseFloat(displayRating) > 10 ? 10 : displayRating}</p>
          <p>장르: {Array.from(selectedGenres).join(', ')}</p>
        </div>
        <button className="upload-button" onClick={handleSubmit}>내용 업로드</button>
      </div>
      <div className="fixed-bottom-center">
        <input type='button' value={'목록으로'} onClick={movieList}/>
      </div>
    </div>
  );
};

export default UploadMovie;
