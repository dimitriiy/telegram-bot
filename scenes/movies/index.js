import { Composer, Markup, Scenes } from "telegraf";
import { kinopoiskApi } from "../../kinopoiskApi/index.js";

const { enter, leave } = Scenes.Stage;

const getMovieLink = new Composer();

getMovieLink.on("text", async (ctx) => {
  await ctx.reply(`Вставьте ссылку на фильм в кинопоиске`);

  return ctx.wizard.next();
});

const askComment = new Composer();

askComment.on("text", async (ctx) => {
  const {
    message: { text },
  } = ctx;

  try {
    const filmId = /film\/(.+)\//.exec(text)[1];
    const { genres, kinopoiskId, nameRu } = await kinopoiskApi(filmId);

    console.log({ genres });
    await ctx.replyWithHTML(
      `Добавить комментарий, пес?`,
      Markup.inlineKeyboard(
        [
          Markup.button.callback("Нет", "no"),
          Markup.button.callback("Да", "yes"),
        ],
        {
          columns: 2,
        }
      )
    );
  } catch (e) {
    console.log(e);
    ctx.replyWithHTML(`<b>Что-то пошло не так, пес!\n</b><a>${e}</a>`);
  }

  return ctx.wizard.next();
});

const addingComment = new Composer();

addingComment.action("yes", async (ctx) => {
  await ctx.reply("yes.");
  await ctx.reply(`Пиши коммент и отправляй!`);

  return ctx.wizard.next();
});

addingComment.action("no", async (ctx) => {
  await ctx.reply("No.");
  await ctx.scene.leave();
});

const getComment = new Composer();

getComment.on("text", async (ctx) => {
  const {
    message: { text },
  } = ctx;
  console.log("HJUJo");
  ctx.reply(text);

  await ctx.scene.leave();
});

export const addingMovieWizard = new Scenes.WizardScene(
  "adding-movie-wizard",
  getMovieLink,
  askComment,
  addingComment,
  getComment
);
