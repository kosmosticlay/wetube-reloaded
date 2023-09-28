/* Video Model 연결 */
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
  // home.pug에 each video in videos때문에 videos 전달해야함
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", {
    pageTitle: video.title,
    video,
    _id: req.session.user ? req.session.user._id : null,
  });
};

/* Edit */
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  // object id가 req.params.id와 같은 경우를 검색 후 true/false값 반환
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
  // await video.save();
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload video" });
};

export const postUpload = async (req, res) => {
  const isHosting = process.env.NODE_ENV === "production";
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHosting
        ? video[0].location
        : video[0].path.replace(/[\\]/g, "/"),
      thumbUrl: isHosting
        ? thumb[0].location
        : thumb[0].path.replace(/[\\]/g, "/"),
      // thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      // multer이 req.file을 제공
      // createdAt: Date.now(), 모델 스키마에 default값 설정했으므로 삭제
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
      /* pre-middleware로 입력값 변환 설정으로 코드 삭제
         hashtags: hashtags.split(",").map((word) => `#${word}`); */
      /* meta: {
         views: 0,
         rating: 0,
      }, default값 설정으로 인해 코드 삭제*/
    });
    console.log(video.fileUrl);
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      $or: [
        { title: { $regex: new RegExp(keyword, "i") } },
        { desc: { $regex: new RegExp(keyword, "i") } },
        { hashtags: { $regex: new RegExp(keyword, "i") } },
      ],
    })
      .sort({ createdAt: "desc" })
      .populate("owner");
  } // let으로 선언한 videos obj를 업데이트만 해주면 된다.
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user }, // req.session.user
    body: { text }, // req.body.text
    params: { id }, // req.params.id
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id); // video가 해당 댓글을 갖게 된 상태로 업데이트된다(video.comments)
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const removeComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const commentUser = await User.findById(comment.owner._id);
  const relatedVideo = await Video.findById(comment.video._id);
  if (!comment) {
    req.flash("error", "Comment not found.");
    return res.sendStatus(400);
  }
  if (!commentUser) {
    req.flash("error", "User not found.");
    return res.sendStatus(400);
  }
  if (!relatedVideo) {
    req.flash("error", "Video not found.");
    return res.sendStatus(400);
  }
  try {
    relatedVideo.comments = relatedVideo.comments.filter(
      (item) => String(comment._id) !== String(item)
    );
    commentUser.comments = commentUser.comments.filter(
      (item) => String(comment._id) !== String(item)
    );
    await Comment.findByIdAndDelete(id);
    await relatedVideo.save();
    await commentUser.save();
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
