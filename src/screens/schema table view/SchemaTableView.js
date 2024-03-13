import react, { useState } from 'react'
import ButtonComponent from '../../components/input components/Button/ButtonComponent'
import ScssStyle from './SchemaTable.module.css'
import { Alert, Button, Drawer, Input, Select } from 'antd'
import { AiOutlineLine } from 'react-icons/ai'
import { GoDotFill } from 'react-icons/go'
import { FaMinusSquare } from 'react-icons/fa'
import axios from 'axios'

const SchemaTableView = () => {
   const [openDrawer, setOpenDrawer] = useState(false)
   const [segmentName, setSegmentName] = useState('')
   const [schema, setSchema] = useState([])
   const [schemaCreation, setSchemaCreation] = useState('')
   const [errorMessage, setErrorMessage] = useState({})
   const schemaOptions = [
      { label: 'First Name', value: 'first_name' },
      { label: 'Last Name', value: 'last_name' },
      { label: 'Gender', value: 'gender' },
      { label: 'Age', value: 'age' },
      { label: 'Account Name', value: 'account_name' },
      { label: 'City', value: 'city' },
      { label: 'State', value: 'state' },
   ]
   const newSchemaCreation = () => {
      let newSchema = []

      for (const data of schema) {
         let newObject = {}
         let optionData = schemaOptions.find(
            (optData) => optData.value === data.value
         )
         if (optionData) {
            newObject[data?.value] = optionData.label
            newSchema.push(newObject)
         }
      }
      console.log(newSchema)
      return newSchema
   }

   const dynamicSchemaOption = (index) => {
      console.log(schema, schemaOptions)
      let newOptions = []
      for (const extOpt of schemaOptions) {
         console.log(
            index,
            schema.some((newOpt) => newOpt.value === extOpt.value)
         )
         if (!schema.some((newOpt) => newOpt.value === extOpt.value)) {
            newOptions.push(extOpt)
         }
      }

      return newOptions
   }
   const sendDataToWebhook = async (data) => {
      console.log(58, data)
      try {
         const response = await fetch(
            'https://webhook.site/4803b9a6-2be6-46a4-8ffd-514315db20ca',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  // Add any other headers if needed
               },
               body: JSON.stringify({
                  // Data you want to send to the webhook
                  data,
                  // Add more data as needed
               }),
            }
         )

         if (!response.ok) {
            throw new Error('Failed to send data to webhook')
         }

         console.log('Data sent to webhook successfully')
      } catch (error) {
         console.error('Error sending data to webhook:', error.message)
      }
   }
   return (
      <div className={ScssStyle.main_div}>
         <div>
            <Button
               onClick={() => {
                  setOpenDrawer(true)
               }}>
               Save Segment
            </Button>
         </div>
         <Drawer
            width={450}
            title='Basic Drawer'
            onClose={() => {
               setOpenDrawer(false)
            }}
            headerStyle={{ backgroundColor: '#3fc1c9', color: 'red' }}
            open={openDrawer}
            className={ScssStyle.drawer_body}>
            <div className={ScssStyle.drawer_body_main}>
               <div className={ScssStyle.drawer_body_main_input}>
                  <b className={ScssStyle.b}>Enter the name of the segment</b>
                  <Input
                     className={ScssStyle.input}
                     value={segmentName}
                     onChange={(e) => {
                        setSegmentName(e.target.value)
                        errorMessage.segmentName = ''
                        setErrorMessage({ ...errorMessage })
                     }}
                  />
                  <span className={ScssStyle.error_message}>
                     {errorMessage.segmentName}
                  </span>
               </div>
               <text className={ScssStyle.drawer_body_main_text}>
                  To save your segment , you need to add the schemas to build
                  the query
               </text>
               <div className={ScssStyle.drawer_body_main_traits_div}>
                  <span className={ScssStyle.drawer_body_main_traits_span}>
                     <span
                        className={ScssStyle.dot}
                        style={{ backgroundColor: 'green' }}></span>
                     <text
                        className={ScssStyle.drawer_body_main_traits_span_text}>
                        - user traits
                     </text>
                  </span>
                  <span className={ScssStyle.drawer_body_main_traits_span}>
                     <span
                        className={ScssStyle.dot}
                        style={{ backgroundColor: 'red' }}></span>
                     <text
                        className={ScssStyle.drawer_body_main_traits_span_text}>
                        - group traits
                     </text>
                  </span>
               </div>

               <div className={ScssStyle.drawer_body_main_schema_div}>
                  {schema.length > 0 &&
                     schema.map((item, index) => {
                        return (
                           <div
                              className={
                                 ScssStyle.drawer_body_main_schema_sub_div
                              }>
                              <GoDotFill
                                 color={Number(index) % 2 ? 'red' : 'green'}
                                 size={24}
                                 style={{
                                    marginTop: '0.5rem',
                                    // padding: '0rem 1rem 0rem 0rem ',
                                 }}
                              />
                              <Select
                                 value={item?.value}
                                 style={{ width: '100%' }}
                                 options={dynamicSchemaOption(index)}
                                 onChange={(value) => {
                                    item.value = value
                                    setSchema([...schema])
                                 }}
                              />
                              <FaMinusSquare
                                 size={20}
                                 style={{
                                    margin: '0.4rem 0.2rem ',
                                    color: '#eee',
                                 }}
                                 onClick={() => {
                                    schema.splice(index, 1)
                                    setSchema([...schema])
                                 }}
                              />
                           </div>
                        )
                     })}
               </div>
               <div className={ScssStyle.drawer_body_main_add_schema_div1}>
                  <div className={ScssStyle.drawer_body_main_add_schema_div}>
                     <GoDotFill
                        color='gray'
                        size={24}
                        style={{
                           marginTop: '0.5rem',
                           // padding: '0rem 1rem 0rem 0rem ',
                        }}
                     />
                     <Select
                        placeholder={'Add schema to segment'}
                        value={schemaCreation}
                        style={{ width: '100%' }}
                        options={dynamicSchemaOption('new')}
                        onChange={(e) => {
                           setSchemaCreation(e)
                           errorMessage.schemaCreation = ''
                           setErrorMessage({ ...errorMessage })
                        }}
                     />
                     <FaMinusSquare
                        size={20}
                        style={{
                           margin: '0.4rem 0.2rem ',
                           color: '#eee',
                        }}
                        onClick={() => {
                           setSchemaCreation('')
                        }}
                     />
                     <span className={ScssStyle.error_message}>
                        {errorMessage.schemaCreation}
                     </span>
                  </div>
                  <text
                     onClick={() => {
                        if (schemaCreation) {
                           schema.push({ value: schemaCreation })
                           setSchema([...schema])
                           setSchemaCreation('')
                        } else {
                           errorMessage.schemaCreation =
                              'Add schema to segment must not be empty'
                           setErrorMessage({ ...errorMessage })
                        }
                     }}>
                     Add new Schema
                  </text>
               </div>
            </div>

            <div className={ScssStyle.drawer_body_footer}>
               <div>
                  <Button
                     type='primary'
                     style={{
                        background: '#3fc1c9',
                        color: '#fff',
                        margin: '0rem 0.5rem',
                     }}
                     onClick={async () => {
                        let isError = false
                        if (!segmentName) {
                           isError = true
                           errorMessage.segmentName =
                              'segment name must not be empty'
                           setErrorMessage({ ...errorMessage })
                        }
                        if (schema.length <= 0) {
                           isError = true
                        }
                        if (!isError) {
                           let data = {
                              segment_name: segmentName,
                              schema: newSchemaCreation(),
                           }
                           await sendDataToWebhook(data)
                        }
                     }}>
                     Save
                  </Button>
                  <Button
                     ghost
                     style={{ border: '1px solid gray', color: '#000' }}>
                     Cancel
                  </Button>
               </div>
            </div>
         </Drawer>
      </div>
   )
}
export default SchemaTableView
