################################################
#### DYNAMIC CONTENT LIB FOR USAGE IN FLUID ####
################################################
#
#  EXAMPLE
#  ---------------
#  Fetch the content from main column of current page
#  <f:cObject typoscriptObjectPath="lib.getContent" />
#
#  Fetch the content from another page
#  <f:cObject typoscriptObjectPath="lib.getContent" data="{pageUid: '{data.uid}'" />
#
#  Some more params
#  <f:cObject typoscriptObjectPath="lib.getContent" data="{pageUid: '{data.uid}', colPos: '0', wrap: '<div class=\"hero\">|</div>'}" />
#
#
#  Use lib.getContentSlide to fetch content from page and parents
#  <f:cObject typoscriptObjectPath="lib.getContent" data="{slide: '-1'"  />
#
#  Inspired from lib.dynamicContent of bootstrap package and GetViewHelper from VHS. Thanks to them
#
#################
lib.getContent = COA
lib.getContent {
    5 = LOAD_REGISTER
    5 {
        colPos.cObject = TEXT
        colPos.cObject {
            field = colPos
            ifEmpty.cObject = TEXT
            ifEmpty.cObject {
                value.current = 1
                ifEmpty = 0
            }
        }
        pageUid.cObject = TEXT
        pageUid.cObject {
            field = pageUid
            ifEmpty.data = TSFE:id
        }
        contentFromPid.cObject = TEXT
        contentFromPid.cObject {
            data = DB:pages:{register:pageUid}:content_from_pid
            data.insertData = 1
        }
        wrap.cObject = TEXT
        wrap.cObject {
            field = wrap
        }
        slide.cObject = TEXT
        slide.cObject {
            field = slide
            ifEmpty.value = 0
        }
    }
    20 = CONTENT
    20 {
        table = tt_content
        select {
            includeRecordsWithoutDefaultTranslation = 1
            orderBy = sorting
            where = colPos={register:colPos}
            where.insertData = 1
            pidInList.data = register:pageUid
            pidInList.override.data = register:contentFromPid
        }
        stdWrap {
            dataWrap = {register:wrap}
            required = 1
        }
        slide.data = register:slide
    }
    99 = RESTORE_REGISTER
}
