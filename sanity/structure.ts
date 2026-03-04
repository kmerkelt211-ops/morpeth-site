import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) => {
  const admissionsStatusList = (title: string, status: string) =>
    S.listItem()
      .title(title)
      .child(
        S.documentTypeList("admissionsEnquiry")
          .title(title)
          .filter('_type == "admissionsEnquiry" && status == $status')
          .params({ status })
          .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
      );

  return S.list()
    .title("Morpeth CMS")
    .items([
      S.listItem()
        .title("Admissions Inbox")
        .child(
          S.list()
            .title("Admissions Inbox")
            .items([
              admissionsStatusList("New", "new"),
              admissionsStatusList("In Review", "in_review"),
              admissionsStatusList("Responded", "responded"),
              admissionsStatusList("Closed", "closed"),
              S.divider(),
              S.documentTypeListItem("admissionsEnquiry").title("All enquiries"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .child(
          S.list()
            .title("Site settings")
            .items([
              S.listItem()
                .title("General settings & contact")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("General settings & contact")
                ),
              S.listItem()
                .title("Hero videos (all pages)")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Hero videos (all pages)")
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Website Pages")
        .child(
          S.list()
            .title("Website Pages")
            .items([
              S.listItem()
                .title("Home")
                .child(
                  S.list()
                    .title("Home")
                    .items([
                      S.listItem()
                        .title("School Pulse media (homepage)")
                        .child(
                          S.document()
                            .schemaType("siteSettings")
                            .documentId("siteSettings")
                            .title("School Pulse media (homepage)")
                        ),
                      S.listItem()
                        .title("Sixth Form highlight media (homepage)")
                        .child(
                          S.document()
                            .schemaType("siteSettings")
                            .documentId("siteSettings")
                            .title("Sixth Form highlight media (homepage)")
                        ),
                      S.documentTypeListItem("studentSpotlight").title("Student spotlights"),
                      S.documentTypeListItem("post").title("News posts"),
                      S.documentTypeListItem("event").title("Calendar events"),
                    ])
                ),
              S.listItem()
                .title("Our School")
                .child(
                  S.list()
                    .title("Our School")
                    .items([
                      S.documentTypeListItem("gcseResults").title("GCSE results"),
                      S.documentTypeListItem("sixthFormResults").title("Sixth Form results"),
                      S.listItem()
                        .title("House pages (for house leads)")
                        .child(
                          S.documentTypeList("house")
                            .title("House pages (select your house)")
                            .defaultOrdering([
                              { field: "order", direction: "asc" },
                              { field: "title", direction: "asc" },
                            ])
                            .child((houseId) =>
                              S.list()
                                .title("House page manager")
                                .items([
                                  S.listItem()
                                    .title("Edit house page content")
                                    .child(
                                      S.document()
                                        .schemaType("house")
                                        .documentId(houseId)
                                    ),
                                  S.listItem()
                                    .title("House updates for this house")
                                    .child(
                                      S.documentTypeList("houseUpdate")
                                        .title("House updates")
                                        .filter('_type == "houseUpdate" && house._ref == $houseId')
                                        .params({ houseId })
                                        .defaultOrdering([
                                          { field: "publishedAt", direction: "desc" },
                                        ])
                                    ),
                                ])
                            )
                        ),
                      S.documentTypeListItem("houseUpdate").title("All house updates"),
                      S.documentTypeListItem("coachingCircles").title("Coaching Circles"),
                    ])
                ),
              S.listItem()
                .title("Teaching & Learning")
                .child(
                  S.document().schemaType("teachingLearningPage").documentId("teachingLearningPage")
                ),
              S.listItem()
                .title("Extracurricular")
                .child(
                  S.document().schemaType("extracurricularPage").documentId("extracurricularPage")
                ),
              S.listItem()
                .title("Parents")
                .child(
                  S.list()
                    .title("Parents")
                    .items([
                      S.listItem()
                        .title("Parents page")
                        .child(S.document().schemaType("parentsPage").documentId("parentsPage")),
                      S.documentTypeListItem("policyDocument").title("Policies"),
                      S.documentTypeListItem("letter").title("Letters home"),
                      S.documentTypeListItem("schoolMenu").title("School lunches"),
                    ])
                ),
              S.listItem()
                .title("Staff")
                .child(S.documentTypeList("staffMember").title("Staff directory")),
              S.listItem().title("Jobs").child(S.documentTypeList("jobPost").title("Vacancies")),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("All Document Types")
        .child(S.list().title("All Document Types").items(S.documentTypeListItems())),
    ]);
};
