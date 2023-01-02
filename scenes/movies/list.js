import { Composer, Markup, Scenes } from "telegraf";
import { db } from "../../db/index.js";
import { splitToPairs } from "../../utils.js";

const { enter, leave } = Scenes.Stage;

const startWizard = new Composer();

const createMoviesButton = (movies, limit, prevOffset, nextOffset) => {
  const moviesButtons = splitToPairs(movies).map(([movieA, movieB]) => {
    if (!movieB)
      return [Markup.button.callback(movieA.title, `movie/${movieA.id}`)];

    return [
      Markup.button.callback(movieA.title, `movie/${movieA.id}`),
      Markup.button.callback(movieB.title, `movie/${movieB.id}`),
    ];
  });

  const paginationButtons = [];

  if (prevOffset !== null) {
    paginationButtons.push(
      Markup.button.callback("◀️", `movies/limit=${limit}&offset=${prevOffset}`)
    );
  }

  if (nextOffset !== null) {
    paginationButtons.push(
      Markup.button.callback(
        "▶️ ",
        `movies/limit=${limit}&offset=${nextOffset}`
      )
    );
  }
  return Markup.inlineKeyboard([...moviesButtons, paginationButtons]);
};

startWizard.on("text", async (ctx) => {
  const { data: movies } = await db.getAllMovies({ limit: 10, offset: 0 });

  ctx.wizard.state.message = { message: ctx.message.message_id };
  await ctx.replyWithHTML(`Hi`, createMoviesButton(movies, 10, null, 1));
  return ctx.wizard.next();
});

const firstName = new Composer();

firstName.action(/movies\/(.*)+/, async (ctx) => {
  const params = Object.fromEntries([...new URLSearchParams(ctx.match[1])]);

  const offset = +params.offset;
  const limit = +params.limit;

  const { data: movies, total } = await db.getAllMovies({ offset, limit });

  const lastMessageID = ctx.wizard.state.message.message;
  const prevPage = offset > 0 ? +offset - 1 : null;
  const nextPage = offset * limit + limit < total ? offset + 1 : null;

  // console.log({ prevPage, nextPage });
  ctx.editMessageReplyMarkup({
    chat_id: ctx.from.id,
    message_id: lastMessageID,
    ...createMoviesButton(movies, limit, prevPage, nextPage).reply_markup,
  });
});

firstName.action(/movie\/(.*)+/, async (ctx) => {
  const [_, id] = ctx.match;

  const movie = await db.getMovieById(id);
  ctx.replyWithHTML(
    `<a href="${movie.link}">${movie.title}\n</a>`
    // Markup.inlineKeyboard(
    //   [
    //     Markup.button.callback("Да", "yes"),
    //     Markup.button.callback("Нет", "no"),
    //   ],
    //   { columns: 2 }
    // )
  );
});

export const movieListWizard = new Scenes.WizardScene(
  "movie-list-wizard",
  startWizard,
  firstName
);
