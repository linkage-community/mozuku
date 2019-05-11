import {
  PostBody,
  BODYPART_TYPE_TEXT,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_LINK
} from './post'

describe('PostBody', () => {
  const t1 = 'http:2134'
  test(`"${t1}" must be TEXT type`, () => {
    const b = new PostBody(t1)
    b.process()
    expect(b.parts).toHaveLength(1)
    expect(b.parts[0].type).toEqual(BODYPART_TYPE_TEXT)
  })

  const t2 = 'は？ https://i.imgur.com/8CZiO2X.png'
  test(`"${t2}" must be splitted to parts with TEXT, LINK_IMAGE type`, () => {
    const b = new PostBody(t2)
    b.process()
    expect(b.parts).toHaveLength(2)
    expect(b.parts[1].type).toEqual(BODYPART_TYPE_LINK_IMAGE)
  })

  const t3 = 'http://nico.ms/sm9'
  test(`"${t3} must be LINK type`, () => {
    const b = new PostBody(t3)
    b.process()
    expect(b.parts).toHaveLength(1)
    expect(b.parts[0].type).toEqual(BODYPART_TYPE_LINK)
  })
})
