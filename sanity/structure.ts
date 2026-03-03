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
                        .title("Site settings")
                        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
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
                      S.documentTypeListItem("house").title("Houses"),
                      S.documentTypeListItem("houseUpdate").title("House updates"),
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
                      S.documentTypeListItem("letter").title("Letters home"),
                      S.documentTypeListItem("schoolMenu").title("School lunches"),
                    ])
                ),
              S.listItem()
                .title("Morpeth TV")
                .child(S.documentTypeList("morpethTvVideo").title("Morpeth TV videos")),
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
