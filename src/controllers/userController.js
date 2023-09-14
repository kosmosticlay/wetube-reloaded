import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  /* password validation */
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
    // return을 입력하지 않으면 코드가 계속 진행된다.
  }

  /* username validation */
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

/* login */
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  // 어떤 방식으로 로그인했는지 사용자가 기억하지 못할 경우를 고려하여, username과 함께 socialOnly: false인 user을 검색
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exsits.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  // 로그인 상태임을 설정 (이 값을 이용하여 Login, Join 메뉴 보이지 않게 별도 설정 가능)

  req.session.user = user;
  /* user: (백엔드의 세션DB에 존재하는 user),
     req.session 객체에 'user'속성으로 세션db내 존재하는 user객체를 할당 */
  return res.redirect("/");
};

/* Github Login */
export const startGithubLogin = (req, res) => {
  const baseUrl = "http://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
    // scope에 들어갈 값들은 공백으로 구분
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  /* finalUrl에 POST 요청을 보내는 방법 */
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    // 만약 json안에 access_token이 존재하면 api 연결
    const { access_token } = tokenRequest;
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
          // access_token을 fetch안의 headers로 보낸다.
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
          // access_token을 fetch안의 headers로 보낸다.
        },
      })
    ).json();

    /* 전달받은 emailData중에 특정 속성값을 갖는 email을 선택 */
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    console.log(user);
    if (!user) {
      /* 해당 email로 된 user가 없으므로 새 계정을 생성; user을 새로 정의 */
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "Unknown",
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    /* 해당 email을 통해 user을 찾았다면 if(!user)문을 스킵하고, 해당 user을 로그인 승인*/
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
  // 만약 response안에 access_token이 없으면 /login으로 redirect
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  console.log(req.session.user);
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
    // uploadFiles 미들웨어가 postEdit 보다 먼저 실행되기 때문에 req.file에 접근 가능
  } = req;
  // const i = req.session.user.id
  // const { name, email, username, location } = req.body;

  /* code challenge */
  try {
    const preUpdateUser = await User.findById(_id);
    /* 기존 데이터와 form에서 받아온 데이터 비교 */
    if (
      preUpdateUser.name !== name ||
      preUpdateUser.email !== email ||
      preUpdateUser.username !== username ||
      preUpdateUser.location !== location
    ) {
      // 중복 검사
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: _id } },
          {
            $or: [{ email }, { username }],
          },
        ],
      });

      if (existingUser) {
        return res.render("edit-profile", {
          notifMessage: "This data is already taken",
        });
      }
    }
    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    console.log(req.file);
    return res.redirect("/users/edit");
  } catch (error) {
    console.error(error);
    return res.redirect("/users/edit-profile");
  }
};

/* change in Password */
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  /* Old Password confirmation */
  const user = await User.findById(_id);
  // DB에 존재하는 가장 최근의 비밀번호를 업데이트(user.password)하여, 사용자가 입력한 oldPassword와 비교
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  /* New password confirmation */
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The new password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save(); // DB에 저장하기 까지 시간이 소요되므로 await 사용
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  const videos = await Video.find({ owner: user._id });
  // user와 owner의 id가 같은 video 목록들을 검색 (array)
  return res.render("users/profile", {
    user,
    pageTitle: user.name,
  });
};
