import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Morpeth CMS')
    .items([
      S.listItem()
        .title('Website Pages')
        .child(
          S.list()
            .title('Website Pages')
            .items([
              S.listItem()
                .title('Home')
                .child(
                  S.list()
                    .title('Home')
                    .items([
                      S.listItem()
                        .title('Site settings')
                        .child(
                          S.document().schemaType('siteSettings').documentId('siteSettings')
                        ),
                      S.documentTypeListItem('post').title('News posts'),
                      S.documentTypeListItem('event').title('Calendar events'),
                    ])
                ),
              S.listItem()
                .title('Our School')
                .child(
                  S.list()
                    .title('Our School')
                    .items([
                      S.documentTypeListItem('gcseResults').title('GCSE results'),
                      S.documentTypeListItem('sixthFormResults').title('Sixth Form results'),
                      S.documentTypeListItem('house').title('Houses'),
                      S.documentTypeListItem('houseUpdate').title('House updates'),
                      S.documentTypeListItem('coachingCircles').title('Coaching Circles'),
                    ])
                ),
              S.listItem()
                .title('Parents')
                .child(
                  S.list()
                    .title('Parents')
                    .items([
                      S.documentTypeListItem('letter').title('Letters home'),
                      S.documentTypeListItem('schoolMenu').title('School lunches'),
                    ])
                ),
              S.listItem()
                .title('Morpeth TV')
                .child(S.documentTypeList('morpethTvVideo').title('Morpeth TV videos')),
              S.listItem()
                .title('Staff')
                .child(S.documentTypeList('staffMember').title('Staff directory')),
              S.listItem()
                .title('Jobs')
                .child(S.documentTypeList('jobPost').title('Vacancies')),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('All Document Types')
        .child(
          S.list()
            .title('All Document Types')
            .items(S.documentTypeListItems())
        ),
    ])
