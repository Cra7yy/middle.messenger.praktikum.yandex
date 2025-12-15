import { InputSign } from '../components/InputSign/InputSign.ts';
import type { Button } from '../components/Button/Button.ts';
import type { ComponentLink } from '../components/ComponentLink/ComponentLink.ts';
import type { ImageProfile } from '../components/ImageProfile/ImageProfile.ts';
import type { ButtonProfile } from '../components/ButtonProfile/ButtonProfile.ts';
import type { InputProfile } from '../components/InputProfile/InputProfile.ts';
import type { ProfileData } from '../components/ProfileData/ProfileData.ts';
import type { ChatCard } from '../components/ChatCard/ChatCard.ts';
import type { ChatImage } from '../components/ChatImage/ChatImage.ts';
import type { Message } from '../components/Message/Message.ts';
import type { UserMessage } from '../components/UserMessage/UserMessage.ts';
import type { ChatDate } from '../components/ChatDate/ChatDate.ts';

export interface SignIn {
  title: string;
  InputLogin: InputSign;
  InputPassword: InputSign;
  ButtonLogin: Button;
  LinkLogin: ComponentLink;
}

export interface SignUp {
  title: string;
  InputEmail: InputSign;
  InputLogin: InputSign;
  InputFirstName: InputSign;
  InputSecondName: InputSign;
  InputPhone: InputSign;
  InputPassword: InputSign;
  InputPasswordAgain: InputSign;
  ButtonRegister: Button;
  LinkRegister: ComponentLink;
}

export interface PasswordEdit {
  ButtonBack: ButtonProfile;
  InputOldPassword: InputProfile;
  InputNewPassword: InputProfile;
  InputNewPasswordAgain: InputProfile;
  AvatarProfile: ImageProfile;
  ButtonSave: Button;
}

export interface ProfileEdit {
  ButtonBack: ButtonProfile;
  AvatarProfile: ImageProfile;
  InputEmail: InputProfile;
  InputLogin: InputProfile;
  InputFirstName: InputProfile;
  InputSecondName: InputProfile;
  InputDisplayName: InputProfile;
  InputPhone: InputProfile;
  ButtonSave: Button;
}

export interface ErrorPage {
  code: string;
  title: string;
  Link: ComponentLink;
}

export interface Profile {
  nameUser: string;
  ButtonBack: ButtonProfile;
  AvatarProfile: ImageProfile;
  EmailBlock: ProfileData;
  LoginBlock: ProfileData;
  FirstNameBlock: ProfileData;
  LastNameBlock: ProfileData;
  DisplayNameBlock: ProfileData;
  PhoneBlock: ProfileData;
}

export interface Chat {
  events?: { [key: string]: (e: Event) => void };
  error: string;
  ChatCard: ChatCard;
  MessageImage: ChatImage;
  ChatMessage: Message;
  ChatUserMessage: UserMessage;
  Date: ChatDate;
}
