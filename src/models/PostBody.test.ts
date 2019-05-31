import {
  PostBody,
  BODYPART_TYPE_TEXT,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_LINK,
  NewBoldMyScreenNameMiddleware,
  pruneEmptyTextMiddleware,
  BODYPART_TYPE_BOLD
} from './Post'
import { Account } from '.'

describe('PostBody', () => {
  describe('process - presetMiddlewares', () => {
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

  describe('process - boldMyScreenNameMiddleware', () => {
    const sn = 'dolphin'
    const a = new Account({
      id: 1,
      name: sn,
      screenName: sn,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
      postsCount: 0,
      avatarFile: null
    })

    const t4 = `@${sn}a 123`
    test(`"${t4}" must be TEXT`, () => {
      // test
      const b = new PostBody(t4)
      const m = NewBoldMyScreenNameMiddleware(a)
      b.process([m, pruneEmptyTextMiddleware])
      expect(b.parts).toHaveLength(1)
      expect(b.parts[0].type).toBe(BODYPART_TYPE_TEXT)
    })
    const t5 = `@${sn} 123`
    test(`"${t5}" must be splitted to BOLD and TEXT`, () => {
      // test
      const b = new PostBody(t5)
      const m = NewBoldMyScreenNameMiddleware(a)
      b.process([m, pruneEmptyTextMiddleware])
      expect(b.parts).toHaveLength(3)
      expect(b.parts[0].type).toBe(BODYPART_TYPE_BOLD)
      expect(b.parts[1].type).toBe(BODYPART_TYPE_TEXT)
      expect(b.parts[2].type).toBe(BODYPART_TYPE_TEXT)
    })
  })
})
