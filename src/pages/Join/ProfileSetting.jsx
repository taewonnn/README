import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ErrorMessage, StyledInput, StyledLabel } from './InputStyle';
import { TitleText, SubTitleText } from './TitleTextStyle';
import { StyledForm } from './FormStyle';
import Button from '../../components/atoms/Button/Button';
import defaultProfileUser from '../../assets/images/default_profile_user.svg';
import ImageUploadBtn from '../../assets/icons/profile-photo.svg';

const ProfileSettingForm = styled(StyledForm)``;

const ProfileImageContainer = styled.div`
    width: 110px;
    height: 110px;
    position: relative;
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 50%;
`;

const ProfileImageInputBtn = styled.button`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    background-image: url(${ImageUploadBtn});
`;

const ProfileImageInput = styled.input`
    visibility: hidden;
`;

export default function ProfileSetting() {
    const [username, setUsername] = useState('');
    const [accountname, setAccountname] = useState('');
    const [intro, setIntro] = useState('');

    const [isDisabled, setIsDisabled] = useState(true); // 버튼 비활성화

    // const [msgUsername, setMsgUsername] = useState('');
    const [isUsername, setIsUsername] = useState(true);

    // username, accountname 둘 중 하나라도 비어있으면 버튼 비활성화 관리
    useEffect(() => {
        if (username && accountname) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [username, accountname]);

    const location = useLocation();

    const email = location.state.email;
    const password = location.state.password;

    const URL = 'https://mandarin.api.weniv.co.kr/';

    const imgInput = useRef();
    const [imageSrc, setImageSrc] = useState('');
    const [imgName, setImgName] = useState('');

    const joinData = {
        user: {
            username,
            email,
            password,
            accountname,
            intro,
            image: imgName,
        },
    };

    const [msgAccountname, setMsgAccountname] = useState('');
    const [isAccountname, setIsAccountname] = useState(true);
    const navigate = useNavigate();

    // API 통신 - 리드미 시작하기 버튼
    const handleJoinSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}user/accountnamevalid`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        accountname,
                    },
                }),
            });
            const result = await response.json();

            console.log(result);

            if (result.message === '이미 가입된 계정ID 입니다.') {
                setMsgAccountname(result.message);
                setIsAccountname(false);
                setIsDisabled(true);
            } else if (result.message === '사용 가능한 계정ID 입니다.') {
                setIsAccountname(true);
            } else {
                setMsgAccountname(result.message);
                setIsAccountname(false);
            }

            console.log(joinData);

            const res = await fetch(`${URL}user`, {
                method: 'POST',
                body: JSON.stringify(joinData),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const userResult = await res.json();

            if (userResult.message === '회원가입 성공') {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 이미지파일 인코딩
    const encodeFileToBase64 = fileBlob => {
        const reader = new FileReader();

        reader.readAsDataURL(fileBlob);

        return new Promise(resolve => {
            reader.onload = async () => {
                const formdata = new FormData();

                formdata.append('image', fileBlob);

                // 이미지 API 통신
                const imgres = await fetch(`${URL}image/uploadfile`, {
                    method: 'POST',
                    body: formdata,
                });

                const imgdata = await imgres.json();

                setImgName(URL + imgdata.filename);
                setImageSrc(reader.result);
                resolve();
            };
        });
    };

    const handleUserNameInput = e => {
        setUsername(e.target.value);
    };

    const handleAccountNameInput = e => {
        setAccountname(e.target.value);
    };

    const handleIntroInput = e => {
        setIntro(e.target.value);
    };

    // 이미지업로드 버튼을 클릭했을 때 input이 실행
    const onClickImageUpload = () => {
        imgInput.current.click();
    };

    // console.log(imgName, imageSrc);

    return (
        <ProfileSettingForm method="POST" onSubmit={handleJoinSubmit}>
            <TitleText>프로필 설정</TitleText>
            <SubTitleText>나중에 언제든지 변경할 수 있습니다.</SubTitleText>
            <ProfileImageContainer>
                <ProfileImage
                    src={imageSrc}
                    id="imagePre"
                    style={
                        imageSrc
                            ? { backgroundImage: `url(${imageSrc})` }
                            : { backgroundImage: `url(${defaultProfileUser})` }
                    }
                    onClick={onClickImageUpload}
                />
                <ProfileImageInputBtn type="button" onClick={onClickImageUpload}>
                    <ProfileImageInput
                        type="file"
                        id="imgUpload"
                        accept="image/*"
                        onChange={e => {
                            encodeFileToBase64(e.target.files[0]);
                        }}
                        name="file"
                        ref={imgInput}
                    />
                </ProfileImageInputBtn>
            </ProfileImageContainer>
            <StyledLabel htmlFor="userName">사용자 이름</StyledLabel>
            <StyledInput
                type="text"
                id="userName"
                onChange={handleUserNameInput}
                className={`${!isUsername ? 'error' : ''}`}
                required
            />
            <StyledLabel htmlFor="userEmail">계정 ID</StyledLabel>
            <StyledInput
                type="text"
                id="userEmail"
                onChange={handleAccountNameInput}
                className={`${!isAccountname ? 'error' : ''}`}
                required
            />
            <ErrorMessage>* 영문,숫자,밑줄 및 마침표만 사용할 수 있습니다.</ErrorMessage>
            <ErrorMessage>* 이미 사용 중인 ID입니다.</ErrorMessage>
            <StyledLabel htmlFor="intro">소개</StyledLabel>
            <StyledInput type="text" id="intro" onChange={handleIntroInput} />
            <Button size="large" type="submit" className={`${isDisabled ? 'disabled' : ''}`}>
                READ ME 시작하기
            </Button>
        </ProfileSettingForm>
    );
}
