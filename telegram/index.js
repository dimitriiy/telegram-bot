import { Markup, Scenes, session, Telegraf } from "telegraf";
import { addingMovieWizard } from "../scenes/movies/index.js";
import { movieListWizard } from "../scenes/movies/list.js";

const { enter, leave } = Scenes.Stage;

const KEY_ACTIONS = {
  add: {
    text: "Добавить фильм",
    callback_data: "ADD_MOVIE",
  },

  getList: {
    text: "Список фильмов",
    callback_data: "GET_LIST",
  },
};

export const initTelegramApi = async () => {
  const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN, {
    polling: true,
  });

  const stage = new Scenes.Stage([addingMovieWizard, movieListWizard]);

  bot.use(session());
  bot.use(stage.middleware());

  await bot.launch({
    host: process.env.URL + `/bot`,
  });

  await bot.start();

  bot.start((ctx) => {
    ctx.replyWithHTML(
      `Hi`,
      Markup.keyboard(
        [
          Markup.button.text(KEY_ACTIONS.add.text),
          Markup.button.text(KEY_ACTIONS.getList.text),
        ],
        {
          columns: 2,
        }
      )
    );
  });

  bot.hears(KEY_ACTIONS.getList.text, (ctx) => {
    ctx.scene.enter("movie-list-wizard");
  });

  bot.hears(KEY_ACTIONS.add.text, (ctx) => {
    ctx.scene.enter("adding-movie-wizard");
  });

  return bot;
};
