// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  // Статистичне приватне поле для зберігання списку об'єктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //Генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  //Статистичний метод для створення об'єкту Track 1 і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Статичтичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static addById(id) {
    return Track.#list.push((track) => track.id === id)
  }
}

Track.create(
  'Інь Ян',
  'MONATIK і ROXOLANA',
  'https://picsum.photos/100/100',
)

Track.create(
  'Moonshine',
  'Zwintar',
  'https://picsum.photos/100/100',
)

Track.create(
  'Секрет',
  'Друга ріка',
  'https://picsum.photos/100/100',
)

Track.create(
  'Кажани',
  'Zwintar',
  'https://picsum.photos/100/100',
)

Track.create(
  'Дощ',
  'Друга ріка',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  //Статистичний метод для створення об'єкту Playlist і додавання його до списку #list

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Статистичний метод дл отримання всього списку плейистів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

//==============

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки`

router.get('/', function (req, res) {
  allTracks = Track.getList()
  console.log(allTracks)

  const allPlaylist = Playlist.getList()
  console.log(allPlaylist)

  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-library', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-library',

    data: {
      list: allPlaylist.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix

  console.log(isMix)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знадено',
        link: '/spotify-playlist',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знадено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

router.get('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  // res.render генерує нам HTML сторінку
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  console.log(playlistId, playlist, allTracks)

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
      name: playlist.name,
    },
  })
})

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// router.get('/spotify-library', function (req, res) {
//   // res.render генерує нам HTML сторінку
//   const id = Number(req.query.id)
//   //   const playlist = Playlist.getById(id)

//   //   const playlistId = Number(req.query.playlistId)
//   const playlist = Playlist.getById(id)
//   const allTracks = Track.getList()

//   //   const id = Number(req.query.id)
//   //   const playlist = Playlist.getById(id)
//   //   const allTracks = Track.getList()

//   //   if (!playlist) {
//   //     return res.render('alert', {
//   //       style: 'alert',

//   //       data: {
//   //         message: 'Помилка',
//   //         info: 'Такого плейліста не знадено',
//   //         link: '/spotify-playlist',
//   //       },
//   //     })
//   //   }

//   res.render('spotify-library', {
//     style: 'spotify-library',

//     data: {
//       playlistId: playlist.id,
//       //   tracks: allTracks,
//       //   name: playlist.name,
//       numb: Number(playlist.track),

//       tracks: playlist.tracks,
//       name: playlist.name,
//     },
//   })
// })

// router.post('/spotify-playlist', function (req, res) {
//   const playlistId = Number(req.body.playlistId)
//   const trackId = Number(req.body.trackId)
//   const playlist = Playlist.getById(playlistId)

//   if (!playlist) {
//     return res.render('alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка',
//         info: 'Такого плейліста не знайдено',
//         link: `/spotify-playlist?id=${playlistId}`,
//       },
//     })
//   }

//   const trackToAdd = Track.getList().find(
//     (track) => track.id === trackId,
//   )

//   if (!trackToAdd) {
//     return res.render('alert', {
//       style: 'alert',
//       data: {
//         message: 'Помилка',
//         info: 'Такого треку не знайдено',
//         link: `/spotify-track-add?playlistId=${playlistId}`,
//       },
//     })
//   }

//   playlist.tracks.push(trackToAdd)

//   res.render('spotify-library', {
//     style: 'spotify-library',
//     data: {
//       playlistId: playlist.id,
//       tracks: playlist.tracks,
//       name: playlist.name,
//     },
//   })
// })
